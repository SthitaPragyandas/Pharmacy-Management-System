document.addEventListener('DOMContentLoaded', function () {
    const apiEndpoint = 'https://api.fda.gov/drug/label.json?limit=50'; // Fetching up to 50 results
    const medicineContainer = document.getElementById('medicineContainer');
    const searchInput = document.getElementById('searchInput');
    const logoutBtn = document.getElementById('logoutBtn');

    const modal = document.getElementById('medicineModal');
    const closeModalBtn = document.querySelector('.close-btn');
    const modalMedicineName = document.getElementById('modalMedicineName');
    const modalManufacturer = document.getElementById('modalManufacturer');
    const modalPurpose = document.getElementById('modalPurpose');
    const modalWarnings = document.getElementById('modalWarnings');
    const modalStopUse = document.getElementById('modalStopUse');
    const modalStorage = document.getElementById('modalStorage');

    // Redirect to index.html on logout
    logoutBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Fetch data from the OpenFDA API
    fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
            const medicines = data?.results;
            console.log(medicines);
            renderMedicines(medicines);
        })
        .catch(error => {
            console.error('Error fetching medicine data:', error);
        });

    // Function to render medicines as cards
    function renderMedicines(medicines) {
        medicineContainer.innerHTML = ''; // Clear existing content

        medicines?.forEach((medicine) => {
            const medicineName = (medicine.openfda?.brand_name && medicine.openfda.brand_name[0]) || 'Generic';
            const manufacturerName = (medicine.openfda?.manufacturer_name && medicine.openfda.manufacturer_name[0]) || 'Unknown';

            // Create a medicine card
            const card = document.createElement('div');
            card.classList.add('medicine-card');
            card.setAttribute('data-name', medicineName.toLowerCase());

            card.innerHTML = `
                <img src="/image.jpg" alt="Medicine Image">
                <h2>${medicineName}</h2>
                <p><strong>Price:</strong> RS ${Math.floor(Math.random() * (100 - 1 + 1)) + 1}</p>
                <button class="more-info-btn" data-medicine-id="${medicine.id}">More Info +</button>
            `;

            card.querySelector('.more-info-btn').addEventListener('click', () => openModal(medicine));
            medicineContainer.appendChild(card);
        });
    }

    // Function to open the modal with detailed information
    function openModal(medicine) {
        modalMedicineName.textContent = (medicine.openfda?.brand_name && medicine.openfda.brand_name[0]) || 'Generic';
        modalManufacturer.textContent = (medicine.openfda?.manufacturer_name && medicine.openfda.manufacturer_name[0]) || 'Unknown';
        modalPurpose.textContent = (medicine.purpose && medicine.purpose[0]) || 'Purpose not Defined';
        modalWarnings.textContent = `${(medicine.do_not_use && medicine.do_not_use[0]) || 'No warnings'}, ${(medicine.keep_out_of_reach_of_children && medicine.keep_out_of_reach_of_children[0]) || 'No specific instructions'}`;
        modalStopUse.textContent = (medicine.stop_use && medicine.stop_use[0]) || 'No stop-use information';
        modalStorage.textContent = (medicine.storage_and_handling && medicine.storage_and_handling[0]) || 'No storage information';

        modal.style.display = 'block';
    }

    // Function to close the modal
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal if the user clicks outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
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
