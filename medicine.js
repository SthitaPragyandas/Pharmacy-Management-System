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
            stock: document.getElementById('stock').value
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
