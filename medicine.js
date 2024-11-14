document.addEventListener('DOMContentLoaded', function () {
    const apiEndpoint = 'http://localhost:8080/api/products';
    const medicineContainer = document.getElementById('medicineContainer');
    const searchInput = document.getElementById('searchInput');
    const logoutBtn = document.getElementById('logoutBtn');
    var productID;
    var errorMesg;
    console.log(errorMesg);
    

    // Modals
    const addMedicineModal = document.getElementById('addMedicineModal');
    const moreInfoModal = document.getElementById('moreInfoModal');
    const quantityModal = document.getElementById('quantityModal'); // New quantity modal
  

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
    const modalexpiryDate=document.getElementById('modalexpiryDate');

    // Quantity Modal Elements
    const quantityInput = document.getElementById('quantityInput'); // Input field for quantity
    const confirmQuantityBtn = document.getElementById('confirmQuantityBtn'); // Confirm button

    const expDateCheck=(productId, operation,expDate)=>{
        const date = new Date(expDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate);
        const today = new Date();
        // Format the dates to yyyy-mm-dd to compare
        const todayFormatted = today.toISOString().split('T')[0];
        if(todayFormatted >= formattedDate){
             document.getElementById("errorMessage").innerText="Mediciene is expired cant sell"
            }
        else{
            currentProductId = productId;
            currentOperation = operation;
            productID=productId
            quantityModal.style.display = 'block';
        }
        
       

        
    }


    // Function to open the quantity modal
    function openQuantityModal(productId, operation,expDate) {
        
        document.getElementById("errorMessage").innerText=""
        if(expDate){
            expDateCheck(productId, operation,expDate)

        }
        else{
            currentProductId = productId;
            currentOperation = operation;
            productID=productId
            quantityModal.style.display = 'block';
            
        }
        
       
    }

    // Fetch and render medicines
    function fetchMedicines() {
        productID=""
        quantityInput.value=""
     
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

    confirmQuantityBtn.addEventListener('click', function () {
                const quantity = parseInt(quantityInput.value);
        
                if (isNaN(quantity) || quantity <= 0) {
                    alert('Please enter a valid quantity');
                    return;
                }
        
                if (currentOperation === 'add') {
                    addStock(productID, quantity);
                } else if (currentOperation === 'sell') {
                    sell(productID, quantity);
                }
        
                quantityModal.style.display = 'none';
            });

   
// Function to increment stock in the database
function addStock(productId,quantity) {
        
    fetch(`http://localhost:8080/api/products/${productId}/incrementStock/${quantity}`, { // Explicit URL
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    
    })
    .then(response => {
        if (response.ok) {
            return response.json();
            

        }
        throw new Error('Failed to increment stock');
    })
    .then(() => {
        // Fetch the updated list of medicines after incrementing stock
        fetchMedicines();
    })
    .catch(error => {
        console.error('Error incrementing stock:', error);
    });
}
function sell(productId,quantity) {
    
    fetch(`http://localhost:8080/api/products/${productId}/decrementStock/${quantity}`, { // Explicit URL
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to increment stock');
    })
    .then(() => {
        // Fetch the updated list of medicines after incrementing stock
        fetchMedicines();
    })
    .catch(error => {
        console.error('Error incrementing stock:', error);
    });
}


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
                <p><strong>Stock:</strong> ${medicine.stock}</p>
                <p ><strong style="margin-top:10px">Full Details :</strong> 
               
                        <img class="more-info-btn" src="/info.jpg" style="width: 40px; height: 40px;border-radius:50%;cursor: pointer;">

                </p>
                <p  id="errorMessage" style="color:red;margin-left:20px;margin-bottom:2px"></p>


                
                  <div class="button-container">
                        
                        <button class="add-stock-btn" style="color:white;background-color:green;border:1px lightgrey solid;border-radius:6px;padding:6px;cursor: pointer;">Add Stock</button>
                        <button class="sell-stock-btn" style="color:white;background-color:orange;width:80px;border:1px lightgrey solid;border-radius:6px;padding:6px;cursor: pointer;">Sell</button>
                </div>
            `;
    
            // Event listener for the More Info button
            card.querySelector('.more-info-btn').addEventListener('click', () => openMoreInfoModal(medicine));
    
            // Event listener for the Add Stock button
            // card.querySelector('.add-stock-btn').addEventListener('click', () => addStock(medicine._id));
            // card.querySelector('.sell-stock-btn').addEventListener('click', () => sell(medicine._id));
            card.querySelector('.add-stock-btn').addEventListener('click', () => openQuantityModal(medicine._id, 'add'));
            card.querySelector('.sell-stock-btn').addEventListener('click', () => openQuantityModal(medicine._id, 'sell',medicine.expiryDate));
    
            medicineContainer.appendChild(card);
        });
    }

    // Function to open the More Info modal
    function openMoreInfoModal(medicine) {

        const date = new Date(medicine.expiryDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        console.log(formattedDate);
        
        
        modalMedicineName.textContent = medicine.title;
        modalManufacturer.textContent = medicine.manufacturers;
        modalPurpose.textContent = medicine.purpose;
        modalWarnings.textContent = medicine.warning;
        modalStock.textContent = medicine.stock;
        modalexpiryDate.textContent=formattedDate=="NaN-NaN-NaN"?"Expiry Date is Not Added":formattedDate

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
    logoutBtn.addEventListener('click', function () {
      window.location.href = '/';  // Redirect to login page
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


// document.addEventListener('DOMContentLoaded', function () {
//     const apiEndpoint = 'http://localhost:8080/api/products';
//     const medicineContainer = document.getElementById('medicineContainer');
//     const searchInput = document.getElementById('searchInput');
//     const logoutBtn = document.getElementById('logoutBtn');

//     // Modals
//     const addMedicineModal = document.getElementById('addMedicineModal');
//     const moreInfoModal = document.getElementById('moreInfoModal');
//     const quantityModal = document.getElementById('quantityModal'); // New quantity modal

//     // Add Medicine Modal Elements
//     const openAddModalBtn = document.getElementById('openAddModalBtn');
//     const closeAddModalBtn = document.querySelector('.close-add-modal-btn');
//     const medicineForm = document.getElementById('medicineForm');

//     // More Info Modal Elements
//     const closeInfoModalBtn = document.querySelector('.close-btn');
//     const modalMedicineName = document.getElementById('modalMedicineName');
//     const modalManufacturer = document.getElementById('modalManufacturer');
//     const modalPurpose = document.getElementById('modalPurpose');
//     const modalWarnings = document.getElementById('modalWarnings');
//     const modalStock = document.getElementById('modalStock');
//     const modalexpiryDate = document.getElementById('modalexpiryDate');

//     // Quantity Modal Elements
//     const quantityInput = document.getElementById('quantityInput'); // Input field for quantity
//     const confirmQuantityBtn = document.getElementById('confirmQuantityBtn'); // Confirm button

//     let currentProductId = null;
//     let currentOperation = null;

//     // Fetch and render medicines
//     function fetchMedicines() {
//         fetch(apiEndpoint)
//             .then(response => response.json())
//             .then(data => {
//                 renderMedicines(data.reverse());
//             })
//             .catch(error => {
//                 console.error('Error fetching medicine data:', error);
//             });
//     }

//     // Initial fetch
//     fetchMedicines();

//     // Function to open the quantity modal
//     function openQuantityModal(productId, operation) {
//         currentProductId = productId;
//         currentOperation = operation;
//         quantityModal.style.display = 'block';
//     }
   

//     // Event listener for confirming the quantity
//     confirmQuantityBtn.addEventListener('click', function () {
//         const quantity = parseInt(quantityInput.value);

//         if (isNaN(quantity) || quantity <= 0) {
//             alert('Please enter a valid quantity');
//             return;
//         }

//         if (currentOperation === 'add') {
//             updateStock(currentProductId, quantity);
//         } else if (currentOperation === 'sell') {
//             updateStock(currentProductId, -quantity);
//         }

//         closeQuantityModal();
//     });

//     // Function to increment or decrement stock based on quantity
//     function updateStock(productId, quantity) {
//         fetch(`http://localhost:8080/api/products/${productId}/updateStock`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ quantity })
//         })
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             }
//             throw new Error('Failed to update stock');
//         })
//         .then(() => {
//             fetchMedicines();
//         })
//         .catch(error => {
//             console.error('Error updating stock:', error);
//         });
//     }

//     function renderMedicines(medicines) {
//         medicineContainer.innerHTML = ''; // Clear existing content
//         medicines.forEach(medicine => {
//             const card = document.createElement('div');
//             card.classList.add('medicine-card');
//             card.setAttribute('data-name', medicine.title.toLowerCase());
    
//             card.innerHTML = `
//                 <img src="/image.jpg" alt="Medicine Image">
//                 <h2>${medicine.title}</h2>
//                 <p><strong>Price:</strong> RS ${medicine.price}</p>
//                 <p><strong>Stock:</strong> ${medicine.stock}</p>
//                 <p><strong style="margin-top:10px">Full Details:</strong> 
//                     <img class="more-info-btn" src="/info.jpg" style="width: 40px; height: 40px; border-radius: 50%; cursor: pointer;">
//                 </p>
//                 <div class="button-container">
//                     <button class="add-stock-btn" style="color:white;background-color:green;border:1px lightgrey solid;border-radius:6px;padding:6px;cursor: pointer;">Add Stock</button>
//                     <button class="sell-stock-btn" style="color:white;background-color:orange;width:80px;border:1px lightgrey solid;border-radius:6px;padding:6px;cursor: pointer;"></button>
//                 </div>
//             `;
    
//             card.querySelector('.more-info-btn').addEventListener('click', () => openMoreInfoModal(medicine));
//             card.querySelector('.add-stock-btn').addEventListener('click', () => openQuantityModal(medicine._id, 'add'));
//             card.querySelector('.sell-stock-btn').addEventListener('click', () => openQuantityModal(medicine._id, 'sell'));
    
//             medicineContainer.appendChild(card);
//         });
//     }

//     // Function to open the More Info modal
//     function openMoreInfoModal(medicine) {
//         const date = new Date(medicine.expiryDate);
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
//         const day = String(date.getDate()).padStart(2, '0');
//         const formattedDate = `${year}-${month}-${day}`;
//         modalMedicineName.textContent = medicine.title;
//         modalManufacturer.textContent = medicine.manufacturers;
//         modalPurpose.textContent = medicine.purpose;
//         modalWarnings.textContent = medicine.warning;
//         modalStock.textContent = medicine.stock;
//         modalexpiryDate.textContent = formattedDate;

//         moreInfoModal.style.display = 'block';
//     }

//     // Function to open the Add Medicine modal
//     openAddModalBtn.addEventListener('click', function () {
//         addMedicineModal.style.display = 'block';
//     });

//     // Function to close the Add Medicine modal
//     closeAddModalBtn.addEventListener('click', function () {
//         addMedicineModal.style.display = 'none';
//     });

//     // Function to close the More Info modal
//     closeInfoModalBtn.addEventListener('click', function () {
//         moreInfoModal.style.display = 'none';
//     });

//     logoutBtn.addEventListener('click', function () {
//         window.location.href = '/'; // Redirect to login page
//     });

//     // Close modals if the user clicks outside the modal content
//     window.addEventListener('click', function (event) {
//         if (event.target === addMedicineModal) {
//             addMedicineModal.style.display = 'none';
//         } else if (event.target === moreInfoModal) {
//             moreInfoModal.style.display = 'none';
//         } else if (event.target === quantityModal) {
//             closeQuantityModal();
//         }
//     });

//     // Handle form submission to add new medicine
//     medicineForm.addEventListener('submit', function (event) {
//         event.preventDefault();

//         const medicineData = {
//             title: document.getElementById('title').value,
//             manufacturers: document.getElementById('manufacturers').value,
//             warning: document.getElementById('warning').value,
//             purpose: document.getElementById('purpose').value,
//             price: document.getElementById('price').value,
//             stock: document.getElementById('stock').value,
//             expiryDate: document.getElementById('expirydate').value
//         };

//         fetch(apiEndpoint, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(medicineData)
//         })
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             }
//             throw new Error('Failed to create medicine');
//         })
//         .then(() => {
//             addMedicineModal.style.display = 'none';
//             medicineForm.reset();
//             fetchMedicines();
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
//     });

//     // Implement the search functionality
//     searchInput.addEventListener('input', function () {
//         const filter = this.value.toLowerCase();
//         const medicineCards = document.querySelectorAll('.medicine-card');

//         medicineCards.forEach(card => {
//             const medicineName = card.getAttribute('data-name');
//             card.style.display = medicineName.includes(filter) ? '' : 'none';
//         });
//     });
// });
