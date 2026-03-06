import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const suggestFood = async (req, res, next) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || ingredients.trim() === '') {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp nguyên liệu.' });
        }

        // Dynamically import Product to avoid any circular dependencies if there are, or simply use normal import from models.
        // The project structure is src/models/Product.js
        const { default: ProductModel } = await import('../../models/Product.js');

        // Fetch all active products
        const products = await ProductModel.find({ is_active: true })
            .select('_id name price images') // Minimal fields for AI to know and for us to return to frontend
            .lean(); // Lean for pure JS object

        // Create catalog list to feed to AI
        const catalogList = products.map(p => `- ID: ${p._id}, Tên Sản Phẩm: ${p.name}, Giá: ${p.price} VND`).join('\n');

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Dựa vào yêu cầu hoặc các nguyên liệu sau: "${ingredients}".
Bạn đóng vai trò là một đầu bếp chuyên nghiệp và một chuyên gia tư vấn ẩm thực thân thiện. 
Dưới đây là danh sách CÁC SẢN PHẨM MÀ SIÊU THỊ ĐANG BÁN:\n${catalogList}\n
Nhiệm vụ của bạn:
1. Gợi ý 1 đến 2 món ăn phù hợp với yêu cầu trên.
2. Dựa vào công thức, HÃY TÌM TRONG DANH SÁCH SẢN PHẨM TRÊN những nguyên liệu cần thiết mà siêu thị có bán. Lấy ra ID của chúng.
3. BẠN PHẢI TRẢ VỀ DỮ LIỆU DƯỚI DẠNG JSON MỘT CÁCH NGHIÊM NGẶT (KHÔNG KÈM QUOTE BÊN NGOÀI, không wrap markdown \`\`\`json). Cấu trúc của JSON phải chính xác như sau:
{
  "text": "Câu trả ngắn gọn của bạn ở đây, bao gồm hướng dẫn và gợi ý ngắn gọn. Hỗ trợ xuống dòng bằng ký tự \\n.",
  "suggested_product_ids": ["ID_sản_phẩm_1", "ID_sản_phẩm_2"]
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let parsedData = {};
        try {
            parsedData = JSON.parse(text);
        } catch (err) {
            console.warn("AI returned malformed JSON:", text);
            // Fallback
            return res.status(200).json({
                success: true,
                text: text, // return raw text if parse fails
                suggestedItems: []
            });
        }

        // Hydrate suggested_product_ids with actual product Objects for the frontend
        let suggestedItems = [];
        if (parsedData.suggested_product_ids && Array.isArray(parsedData.suggested_product_ids)) {
            // Find products matching the id array
            suggestedItems = products.filter(p => parsedData.suggested_product_ids.includes(p._id.toString()));
        }

        return res.status(200).json({
            success: true,
            text: parsedData.text || "Đây là gợi ý món ngon cho bạn!",
            suggestedItems
        });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return res.status(500).json({ success: false, message: 'Lỗi khi gọi AI gợi ý món ăn.', error: error.message });
    }
};

export default {
    suggestFood,
};
