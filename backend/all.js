const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    manufacturers: { type: String, required: true },
    warning: { type: String, required: true },
    purpose: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    expiryDate:{type: Date, required: true}
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;


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

const akif='mongodb+srv://akifmohammed:CacuR2xie7ASJLze@cluster0.64mpu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const priya="mongodb+srv://pbrata13:JygjatW2NAY8HdOT@cluster0.6ndsa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Connect to MongoDB (replace <username>, <password>, <dbname> with your details)
mongoose.connect(akif, {
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
        const { title, manufacturers, warning, purpose, price, stock,expiryDate} = req.body;

        // Create a new product instance
        const product = new Product({
            title,
            manufacturers,
            warning,
            purpose,
            price,
            stock,
            expiryDate
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

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Medicine Cards</title>
    <link rel="stylesheet" href="mediciene.css">
</head>
<body>
    <div style="float: right;">
        <span id="userName">Hi, <strong><i>Sthita Pragyan Das</i></strong></span> <!-- Placeholder name -->
        <button id="logoutBtn" style="background-color: brown; color: white; border-radius: 4px; border-color: rgb(223, 235, 235); cursor: pointer; margin-bottom: 10px"><u>Logout</u></button>
    </div>
    <div  style="margin-top: 50px;">
        <h1>Pharmacy Management DashBoard</h1>
      

    </div>

    <!-- Search Bar -->
    <div class="search-bar">
        <input type="text" id="searchInput" placeholder="Search by medicine name...">
    </div>

    <!-- Add Medicines Button -->
    <div class="cta-container">
        <button class="add-medicine" id="openAddModalBtn">Add Medicines</button>
    </div>

    <!-- Medicines Container -->
    <div class="medicine-container" id="medicineContainer"></div>

    <!-- Add Medicine Modal -->
    <div id="addMedicineModal" class="modal">
        <div class="modal-content">
            <span class="close-add-modal-btn">&times;</span>
            <h2>Add Medicine</h2>
            <form id="medicineForm">
                <div class="form-container">
                    <div>
                        <input type="text" id="title" placeholder="Title" required><br>
                        <input type="text" id="manufacturers" placeholder="Manufacturers" required><br>
                        <input type="text" id="warning" placeholder="Warning" required><br>
                        <input type="text"  placeholder="Select Exipiry Date" disabled><br>
                    </div>
                    <div>
                        <input type="text" id="purpose" placeholder="Purpose" required><br>
                        <input type="number" id="price" placeholder="Price" required><br>
                        <input type="number" id="stock" placeholder="Stock" required><br>
                        <input type="date"    id="expirydate"  required><br>
                    </div>

                </div>
                <div class="button-container">
                    <button type="submit" class="add-cta">Add Medicine</button>
                </div>
            </form>
        </div>
    </div>

    <!-- More Info Modal -->
    <div id="moreInfoModal" class="modal">
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2 id="modalMedicineName">Medicine Name</h2>
            <p><strong>Manufacturer:</strong> <span id="modalManufacturer"></span></p>
            <p><strong>Purpose:</strong> <span id="modalPurpose"></span></p>
            <p><strong>Warnings:</strong> <span id="modalWarnings"></span></p>
            <p><strong>Stock:</strong> <span id="modalStock"></span></p>
        </div>
    </div>

    <script src="medicine.js"></script>
</body>
</html>
document.addEventListener('DOMContentLoaded', function () {
    const apiEndpoint = 'http://localhost:8080/api/products';
    const medicineContainer = document.getElementById('medicineContainer');
    const searchInput = document.getElementById('searchInput');
    const logoutBtn = document.getElementById('logoutBtn');

    // Modals
    const addMedicineModal = document.getElementById('addMedicineModal');
    const moreInfoModal = document.getElementById('moreInfoModal');

    // Add Medicine Modal Elements
    const openAddModalBtn = document.getElementById('openAddModalBtn');
    const closeAddModalBtn = document.querySelector('.close-add-modal-btn');
    const medicineForm = document.getElementById('medicineForm');

    // More Info Modal Elements
    const closeInfoModalBtn = document.querySelector('.close-btn');
    const modalMedicineName = document.getElementById('modalMedicineName');
    const modalManufacturer = document.getElementById('modalManufacturer');
    const modalPurpose = document.getElementById('modalPurpose');
    const modalWarnings = document.getElementById('modalWarnings');
    const modalStock = document.getElementById('modalStock');

    // Fetch and render medicines
    function fetchMedicines() {
        fetch(apiEndpoint)
            .then(response => response.json())
            .then(data => {
                renderMedicines(data.reverse());
            })
            .catch(error => {
                console.error('Error fetching medicine data:', error);
            });
    }

    // Initial fetch
    fetchMedicines();

    // Function to render medicines as cards
    function renderMedicines(medicines) {
        medicineContainer.innerHTML = ''; // Clear existing content
        medicines.forEach(medicine => {
            const card = document.createElement('div');
            card.classList.add('medicine-card');
            card.setAttribute('data-name', medicine.title.toLowerCase());

            card.innerHTML = `
                <img src="/image.jpg" alt="Medicine Image">
                <h2>${medicine.title}</h2>
                <p><strong>Price:</strong> RS ${medicine.price}</p>
                <button class="more-info-btn">More Info +</button>
            `;

            // Add event listener for the More Info button
            card.querySelector('.more-info-btn').addEventListener('click', () => openMoreInfoModal(medicine));

            medicineContainer.appendChild(card);
        });
    }

    // Function to open the More Info modal
    function openMoreInfoModal(medicine) {
        modalMedicineName.textContent = medicine.title;
        modalManufacturer.textContent = medicine.manufacturers;
        modalPurpose.textContent = medicine.purpose;
        modalWarnings.textContent = medicine.warning;
        modalStock.textContent = medicine.stock;

        moreInfoModal.style.display = 'block';
    }

    // Function to open the Add Medicine modal
    openAddModalBtn.addEventListener('click', function () {
        addMedicineModal.style.display = 'block';
    });

    // Function to close the Add Medicine modal
    closeAddModalBtn.addEventListener('click', function () {
        addMedicineModal.style.display = 'none';
    });

    // Function to close the More Info modal
    closeInfoModalBtn.addEventListener('click', function () {
        moreInfoModal.style.display = 'none';
    });

    // Close modals if the user clicks outside the modal content
    window.addEventListener('click', function (event) {
        if (event.target === addMedicineModal) {
            addMedicineModal.style.display = 'none';
        } else if (event.target === moreInfoModal) {
            moreInfoModal.style.display = 'none';
        }
    });

    // Handle form submission to add new medicine
    medicineForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const medicineData = {
            title: document.getElementById('title').value,
            manufacturers: document.getElementById('manufacturers').value,
            warning: document.getElementById('warning').value,
            purpose: document.getElementById('purpose').value,
            price: document.getElementById('price').value,
            stock: document.getElementById('stock').value,
            expiryDate:document.getElementById('expirydate').value
        };

        // POST request to add new medicine
        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(medicineData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to create medicine');
        })
        .then(() => {
            // Close the add medicine modal
            addMedicineModal.style.display = 'none';
            // Clear input fields
            medicineForm.reset();
            // Fetch the updated list of medicines
            fetchMedicines();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Implement the search functionality
    searchInput.addEventListener('input', function () {
        const filter = this.value.toLowerCase();
        const medicineCards = document.querySelectorAll('.medicine-card');

        medicineCards.forEach(card => {
            const medicineName = card.getAttribute('data-name');
            if (medicineName.includes(filter)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

