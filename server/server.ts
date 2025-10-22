export {};
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./db');
const { Product } = require('./models/Product');
const { User } = require('./models/User');
const { Order } = require('./models/Order');

dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

const path = require('path');
const fs = require('fs');
const distPath = path.resolve(__dirname, '..', 'dist');

// Optional server-side Gemini proxy (only configured if GEMINI_API_KEY is set)
let genaiClient: any = null;
if (process.env.GEMINI_API_KEY) {
    try {
        const { GoogleGenAI } = require('@google/genai');
        genaiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        console.log('Server-side Gemini proxy enabled.');
        } catch (err: any) {
            console.warn('Could not initialize server-side Gemini client:', err?.message || err);
        }
}

app.post('/api/generate-description', async (req: any, res: any) => {
    if (!genaiClient) {
        return res.status(503).json({ message: 'AI service not available' });
    }

    const { productName, keywords } = req.body;
    if (!productName) return res.status(400).json({ message: 'productName is required' });

    const prompt = `You are a professional e-commerce copywriter. Write a compelling, brief, and enticing product description for the following product. Product Name: ${productName} Keywords to include: ${keywords}. The description should be a single paragraph, no more than 4 sentences.`;

    try {
        const response = await genaiClient.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return res.json({ description: response.text });
    } catch (err: any) {
        console.error('Error calling Gemini on server:', err);
        return res.status(500).json({ message: 'AI generation error' });
    }
});

// Connect to MongoDB
connectDB();

// Basic Product Routes
app.get('/api/products', async (req: any, res: any) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/api/products/:id', async (req: any, res: any) => {
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

// Basic User Routes
app.post('/api/users/register', async (req: any, res: any) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            name,
            email,
            password // Note: In production, password should be hashed
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Basic Order Routes
app.post('/api/orders', async (req: any, res: any) => {
    try {
        const { 
            user,
            items,
            shippingAddress,
            paymentMethod,
            totalPrice
        } = req.body;

        const order = await Order.create({
            user,
            items,
            shippingAddress,
            paymentMethod,
            totalPrice
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

app.get('/api/orders/:userId', async (req: any, res: any) => {
    try {
        const orders = await Order.find({ user: req.params.userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Health check route
app.get('/', (req: any, res: any) => {
    res.send('API is running...');
});

// Serve frontend static files from the Vite build (if present)
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    // Always return index.html for any unknown route (SPA)
    app.get('/*', (req: any, res: any) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});