const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Product = require('./models/Product');

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: '*', // Allow any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

// Connect to MongoDB (replace <username>, <password>, <dbname> with your details)
mongoose.connect('mongodb+srv://akifmohammed:CacuR2xie7ASJLze@cluster0.64mpu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error(err));

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// API to create a new product
app.post('/api/products', async (req, res) => {
    try {
        const { title, manufacturers, warning, purpose, price, stock } = req.body;

        // Create a new product instance
        const product = new Product({
            title,
            manufacturers,
            warning,
            purpose,
            price,
            stock
        });

        // Save the product to the database
        await product.save();
        res.status(200).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// API to get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

