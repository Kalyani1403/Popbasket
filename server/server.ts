import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { connectDB } from './db';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import userRoutes from './routes/users';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Resolve frontend dist directory
let distPath: string | undefined;

if (path.basename(__dirname).toLowerCase() === 'dist') {
    distPath = __dirname;
} else {
    const distCandidates = [
        path.resolve(__dirname, '..', 'dist'),
        path.resolve(__dirname, '..', '..', 'dist'),
        path.resolve(__dirname, '..')
    ];

    distPath = distCandidates.find(p => {
        try { return fs.existsSync(p); } catch (e) { return false; }
    });
}

// Optional server-side Gemini proxy
let genaiClient: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY) {
    try {
        genaiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log('Server-side Gemini proxy enabled.');
    } catch (err) {
        console.warn('Could not initialize server-side Gemini client:', err);
    }
}

// Generate product description endpoint
app.post('/api/generate-description', async (req: express.Request, res: express.Response) => {
    if (!genaiClient) {
        return res.status(503).json({ message: 'AI service not available' });
    }

    const { productName, keywords } = req.body;
    if (!productName) {
        return res.status(400).json({ message: 'productName is required' });
    }

    const prompt = `You are a professional e-commerce copywriter. Write a compelling, brief, and enticing product description for the following product. Product Name: ${productName} Keywords to include: ${keywords}. The description should be a single paragraph, no more than 4 sentences.`;

    try {
        const model = genaiClient.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return res.json({ description: response.text() });
    } catch (err) {
        console.error('Error calling Gemini on server:', err);
        return res.status(500).json({ message: 'AI generation error' });
    }
});

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/', (req: express.Request, res: express.Response) => {
    res.send('API is running...');
});

// Serve static assets in production
if (distPath) {
    app.use(express.static(distPath));
    // Handle SPA routing - return index.html for all routes
    app.get('*', (req: express.Request, res: express.Response) => {
        res.sendFile(path.resolve(distPath!, 'index.html'));
    });
}

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});