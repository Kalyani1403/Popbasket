import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import { Product } from '../models/Product';

dotenv.config();

const products = [
    {
        name: "Premium Laptop",
        description: "High-performance laptop with latest specifications",
        price: 999.99,
        imageUrl: "/img/hero-banner.jpg",
        category: "Electronics",
        stock: 50,
    },
    {
        name: "Wireless Earbuds",
        description: "Premium wireless earbuds with noise cancellation",
        price: 149.99,
        imageUrl: "/img/products/earbuds.jpg",
        category: "Electronics",
        stock: 100,
    },
    {
        name: "Smart Watch",
        description: "Feature-rich smartwatch with health tracking",
        price: 199.99,
        imageUrl: "/img/products/smartwatch.jpg",
        category: "Electronics",
        stock: 75,
    },
    {
        name: "4K Monitor",
        description: "Ultra-wide 4K monitor for professional use",
        price: 499.99,
        imageUrl: "/img/products/monitor.jpg",
        category: "Electronics",
        stock: 30,
    }
];

const seedProducts = async () => {
    try {
        await connectDB();
        
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        const createdProducts = await Product.insertMany(products);
        console.log('Products seeded successfully:', createdProducts.length, 'products added');

        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

// Run the seeding
seedProducts();