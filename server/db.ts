const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Mark this file as a module to avoid TypeScript treating it as a global script
export {};

dotenv.config();

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI is not set in environment');
        process.exit(1);
    }

    // Mask the credentials for logging
    const masked = uri.replace(/(mongodb\+srv:\/\/)(.*):(.*)@/, '$1***:***@');

    try {
        // Add short timeouts for quicker failure feedback during development
        const conn = await mongoose.connect(uri, {
            // Mongoose v6+ defaults are fine; add timeouts and family to improve reliability
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4 to avoid IPv6 DNS issues in some environments
            // tls is true for mongodb+srv (Atlas) but mongoose will infer it
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error('MongoDB connection error (masked URI):', masked);
        // Provide actionable hints
        console.error('Error message:', error && error.message ? error.message : error);
        console.error('Hints:');
        console.error('- Ensure your IP is allowed in the Atlas Network Access (IP whitelist).');
        console.error('- If using a VPN or corporate network, try from a different network or allow access from 0.0.0.0/0 for testing.');
        console.error('- Verify the user, password, and database in the connection string are correct.');
        console.error('- If your connection string contains special characters, ensure they are URL-encoded.');
        process.exit(1);
    }
};

module.exports = { connectDB };