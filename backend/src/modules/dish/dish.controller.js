import {
    createDish,
    deleteDish,
    getAllDishes,
    getDishById,
    updateDish,
} from './dish.service.js';

export const getAllDishesController = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const dishes = await getAllDishes({
            keyword,
        });
        res.json({ success: true, data: dishes });
    } catch (error) {
        next(error);
    }
};

export const getDishByIdController = async (req, res, next) => {
    try {
        const dish = await getDishById(req.params.id);

        if (!dish) {
            return res.status(404).json({
                success: false,
                message: 'Dish not found',
            });
        }

        res.json({ success: true, data: dish });
    } catch (error) {
        next(error);
    }
};

export const createDishController = async (req, res, next) => {
    try {
        const dish = await createDish(req.body, req.files);
        res.status(201).json({
            success: true,
            data: dish,
        });
    } catch (error) {
        next(error);
    }
};

export const updateDishController = async (req, res, next) => {
    try {
        const dish = await updateDish(req.params.id, req.body, req.files);
        res.json({ success: true, data: dish });
    } catch (error) {
        next(error);
    }
};

export const deleteDishController = async (req, res, next) => {
    try {
        const dish = await deleteDish(req.params.id);
        res.json({ success: true, data: dish });
    } catch (error) {
        next(error);
    }
};
