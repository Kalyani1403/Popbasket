import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

interface UpdateUserRequest extends Request {
    body: {
        name?: string;
        email?: string;
        password?: string;
    }
}

// Get user profile
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req: UpdateUserRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();
            const userResponse = {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                wishlist: updatedUser.wishlist
            };

            res.json(userResponse);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get all users (admin only)
router.get('/', [authMiddleware, adminMiddleware], async (req: Request, res: Response) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete user (admin only)
router.delete('/:id', [authMiddleware, adminMiddleware], async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.isAdmin) {
                res.status(400).json({ message: 'Cannot delete admin user' });
                return;
            }
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add product to wishlist
router.post('/wishlist/:productId', authMiddleware, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (user) {
            if (user.wishlist.includes(product._id)) {
                return res.status(400).json({ message: 'Product already in wishlist' });
            }

            user.wishlist.push(product._id);
            await user.save();

            res.json(user.wishlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Remove product from wishlist
router.delete('/wishlist/:productId', authMiddleware, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);
        if (user) {
            user.wishlist = user.wishlist.filter(
                id => id.toString() !== req.params.productId
            );
            await user.save();
            res.json(user.wishlist);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;