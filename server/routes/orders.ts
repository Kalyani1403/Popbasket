import { Router, Request, Response } from 'express';
import { Order } from '../models/Order';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

interface OrderRequest extends Request {
    body: {
        items: Array<{
            product: string;
            quantity: number;
            price: number;
        }>;
        shippingAddress: {
            address: string;
            city: string;
            postalCode: string;
            country: string;
        };
        paymentMethod: string;
        totalPrice: number;
    }
}

// Get all orders (admin only)
router.get('/', [authMiddleware, adminMiddleware], async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('items.product', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get user's orders
router.get('/myorders', authMiddleware, async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ user: req.user?._id })
            .populate('items.product', 'name price imageUrl');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get order by ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name price imageUrl');

        if (order) {
            // Check if the order belongs to the logged-in user or if the user is an admin
            if (order.user._id.toString() === req.user?._id.toString() || req.user?.isAdmin) {
                res.json(order);
            } else {
                res.status(403).json({ message: 'Not authorized to access this order' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Create new order
router.post('/', authMiddleware, async (req: OrderRequest, res: Response) => {
    try {
        const { items, shippingAddress, paymentMethod, totalPrice } = req.body;

        if (items && items.length === 0) {
            res.status(400).json({ message: 'No order items' });
            return;
        }

        const order = new Order({
            user: req.user?._id,
            items,
            shippingAddress,
            paymentMethod,
            totalPrice,
            status: 'Pending'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update order status (admin only)
router.put('/:id/status', [authMiddleware, adminMiddleware], async (req: Request, res: Response) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            if (status === 'Paid') {
                order.paymentResult = {
                    id: String(Date.now()),
                    status: 'completed',
                    update_time: new Date().toISOString(),
                    email_address: req.user?.email
                };
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete order (admin only)
router.delete('/:id', [authMiddleware, adminMiddleware], async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;