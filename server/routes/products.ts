import { Router, Request, Response } from 'express';
import { Product } from '../models/Product';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

interface RatingRequest extends Request {
    body: {
        rating: number;
        review?: string;
    }
}

interface ProductRequest extends Request {
    body: {
        name: string;
        description: string;
        price: number;
        imageUrl: string;
        category: string;
        stock: number;
    }
}

// Get all products
router.get('/', async (req: Request, res: Response) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get single product by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create new product (admin only)
router.post('/', [authMiddleware, adminMiddleware], async (req: ProductRequest, res: Response) => {
    try {
        const { name, description, price, imageUrl, category, stock } = req.body;

        const product = new Product({
            name,
            description,
            price,
            imageUrl,
            category,
            stock
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update product (admin only)
router.put('/:id', [authMiddleware, adminMiddleware], async (req: ProductRequest, res: Response) => {
    try {
        const { name, description, price, imageUrl, category, stock } = req.body;

        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.imageUrl = imageUrl || product.imageUrl;
            product.category = category || product.category;
            product.stock = stock || product.stock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete product (admin only)
router.delete('/:id', [authMiddleware, adminMiddleware], async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add rating to product
router.post('/:id/rate', authMiddleware, async (req: RatingRequest, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product && req.user) {
            const { rating, review } = req.body;
            const userId = req.user._id;

            // Check if user has already rated this product
            const alreadyRated = product.ratings.find(r => r.userId?.toString() === userId.toString());
            if (alreadyRated) {
                return res.status(400).json({ message: 'You have already rated this product' });
            }

            // Add new rating
            product.ratings.push({
                userId,
                rating,
                review
            });

            // Update average rating
            const totalRatings = product.ratings.reduce((acc, item) => acc + (item.rating || 0), 0);
            product.averageRating = totalRatings / product.ratings.length;

            await product.save();
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;