import { Layout, Button, Rate, Carousel } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../../../context/CartContext';

import './HomePage.css';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { API_URL } from '../../../config';

const { Content } = Layout;

export default function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // Hàm chia array thành chunks
  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  /* ================= FETCH API ================= */

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      const data = await res.json();

      setCategories(
        Array.isArray(data) ? data : data.data || data.categories || [],
      );
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();

      setProducts(
        Array.isArray(data) ? data : data.data || data.products || [],
      );
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);
  return (
    <Layout className='layout'>
      <Header />

      <Content>
        {/* ===== HERO (GIỮ NGUYÊN) ===== */}
        <section className='hero'>
          <div className='hero-text'>
            <h1>Nông sản sạch từ nông trại đến bàn ăn</h1>
            <p>
              Rau củ, thịt và cá chất lượng cao được giao tươi mới đến tận cửa
              nhà bạn.
            </p>
            <div className='hero-actions'>
              <Button
                type='primary'
                onClick={() => navigate('/category')}
              >
                Mua sắm ngay
              </Button>
              <Button>Tìm hiểu thêm</Button>
            </div>
          </div>

          <img
            src='https://images.unsplash.com/photo-1542838132-92c53300491e'
            alt='hero'
          />
        </section>
        <section className='section-category'>
          <h2 className='section-title'>Mua sắm theo danh mục</h2>
          <p className='section-subtitle'>
            Khám phá các sản phẩm cao cấp của chúng tôi
          </p>

          <Carousel
            autoplay
            autoplaySpeed={5000}
            draggable
            arrows
            dotsClass='custom-dots'
            infinite
          >
            {chunkArray(categories, 4).map((chunk, chunkIdx) => (
              <div key={chunkIdx}>
                <div className='category-grid'>
                  {chunk.map((c) => {
                    // Prioritize the dynamic image set in the Admin Panel
                    let imagePath = c.image;

                    // Fallback to hardcoded images if no dynamic image is set
                    if (!imagePath) {
                      const nameLower = c.name?.toLowerCase() || '';
                      if (nameLower.includes('Cá') || nameLower.includes('Cá'))
                        imagePath = '/images/categories/ca.jpg';
                      else if (nameLower.includes('Thịt'))
                        imagePath = '/images/categories/thit.webp';
                      else if (nameLower.includes('Rau Củ'))
                        imagePath = '/images/categories/rau.jpg';
                      else if (nameLower.includes('Gia Vị'))
                        imagePath = '/images/categories/giavi.jpg';
                      else if (nameLower.includes('Trái Cây'))
                        imagePath = '/images/categories/traicay.webp';
                      else
                        imagePath =
                          'https://via.placeholder.com/300x200?text=' +
                          encodeURIComponent(c.name);
                    }

                    return (
                      <div
                        className='category-card'
                        key={c._id || c.id}
                        onClick={() => navigate(`/category/${c._id || c.id}`)}
                      >
                        <div className='category-image'>
                          <img
                            src={imagePath}
                            alt={c.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                        <h4>{c.name}</h4>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </Carousel>
        </section>

        {/* ===== FEATURED PRODUCTS (SỬA ẢNH + TITLE) ===== */}
        <section className='section section-featured'>
          <h2 className='section-title'>Sản phẩm nổi bật</h2>
          <p className='section-subtitle'>
            Các mặt hàng được ưa chuộng nhất tuần này
          </p>

          <div className='product-grid'>
            {products.slice(0, 8).map((p) => (
              <div
                className='product-card'
                key={p._id || p.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/products/${p._id || p.id}`)}
              >
                <div className='product-image'>
                  <img
                    src={
                      p.images?.[0]?.url || 'https://via.placeholder.com/300'
                    }
                    alt={p.name}
                  />
                </div>

                <div className='product-body'>
                  <span className='product-category'>
                    {p.category?.name || p.category}
                  </span>

                  <h3>{p.name}</h3>

                  <div className='product-rate'>
                    <Rate
                      disabled
                      defaultValue={p.rate || 5}
                    />
                    <span className='rate-count'>(124)</span>
                  </div>

                  <div className='product-footer'>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className='product-price'>
                        {p.price.toLocaleString('vi-VN')} VND
                      </span>
                      <span
                        style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}
                      >
                        / {p.weight} {p.unit}
                      </span>
                    </div>

                    <Button
                      className='app-btn'
                      icon={<ShoppingCartOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                      }}
                    >
                      Thêm
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== WHY CHOOSE (GIỮ NGUYÊN) ===== */}
        <section
          style={{
            padding: '100px 10%',
            background: '#f9fafc',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: 34, fontWeight: 700 }}>
            Tại sao chọn FreshMart?
          </h2>
          <p style={{ color: '#666', marginBottom: 60 }}>
            Chất lượng, sự tươi mới và bền vững trong từng đơn hàng
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 30,
            }}
          >
            {[
              {
                icon: '🌿',
                title: 'Nông sản tươi',
                desc: 'Lấy trực tiếp từ các nông trại uy tín mỗi ngày.',
              },
              {
                icon: '🚚',
                title: 'Giao hàng nhanh chóng',
                desc: 'Giao hàng trong ngày để đảm bảo độ tươi ngon nhất.',
              },
              {
                icon: '🛡️',
                title: 'Đảm bảo chất lượng',
                desc: 'Kiểm tra nghiêm ngặt trước khi giao hàng.',
              },
              {
                icon: '🏅',
                title: 'Chứng nhận hữu cơ',
                desc: '90% sản phẩm có chứng nhận hữu cơ.',
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: '#fff',
                  padding: 35,
                  borderRadius: 20,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 15 }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 600 }}>{item.title}</h3>
                <p style={{ color: '#666' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== NEWSLETTER (GIỮ NGUYÊN) ===== */}
        <section
          style={{
            padding: '120px 10%',
            background: 'linear-gradient(135deg, #00c853, #00bfa5)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(15px)',
              padding: 60,
              borderRadius: 25,
              textAlign: 'center',
              color: 'white',
              width: '100%',
              maxWidth: 700,
            }}
          >
            <h2 style={{ fontSize: 32, fontWeight: 700 }}>Đăng ký nhận tin</h2>
            <p style={{ margin: '20px 0 40px' }}>
              Đăng ký nhận ưu đãi độc quyền & tin tức từ siêu thị
            </p>

            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
              }}
            >
              <input
                type='email'
                placeholder='Nhập email của bạn'
                style={{
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: 'none',
                  width: '60%',
                  outline: 'none',
                }}
              />

              <button
                style={{
                  padding: '14px 26px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'white',
                  color: '#00bfa5',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Đăng ký
              </button>
            </div>
          </div>
        </section>
      </Content>

      <Footer />
    </Layout>
  );
}
