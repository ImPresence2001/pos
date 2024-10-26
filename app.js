// app.js

//INVENTORY BUTTONS ADD PRODUCT, EDIT, DELETE.
// Load products from local storage and display them
window.onload = function() {
  const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
  storedProducts.forEach(product => addProductToList(product));
};

// Function to add a product to the list
function addProductToList(product) {
  const productList = document.getElementById("product-list");

  // Create new list item for the product
  const listItem = document.createElement("li");
  listItem.className = "list-group-item d-flex justify-content-between align-items-center";
  listItem.innerHTML = `
      ${product.name} (${product.category}) - $${product.price} | Qty: ${product.quantity}
      <div>
          <button class="btn btn-secondary btn-sm edit-product">Edit</button>
          <button class="btn btn-danger btn-sm delete-product">Remove</button>
      </div>
  `;

  // Append the new item to the product list
  productList.appendChild(listItem);

  // Add event listener for the edit button
  listItem.querySelector(".edit-product").addEventListener("click", function() {
      // Populate the form with the product details for editing
      document.getElementById("category").value = product.category;
      document.getElementById("product-name").value = product.name;
      document.getElementById("price").value = product.price;
      document.getElementById("quantity").value = product.quantity;

      // Remove the product from the list and storage (optional)
      removeProductFromStorage(product); // Remove from storage
      productList.removeChild(listItem); // Remove from the display
  });

  // Add event listener for delete button
  listItem.querySelector(".delete-product").addEventListener("click", function() {
      productList.removeChild(listItem);
      removeProductFromStorage(product); // Remove from storage
  });
}

// Function to handle form submission
document.getElementById("add-product").addEventListener("click", function() {
  const category = document.getElementById("category").value;
  const productName = document.getElementById("product-name").value;
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;

  // Validate form inputs
  if (category === "" || productName === "" || price === "" || quantity === "") {
      alert("Please fill out all fields.");
      return;
  }

  // Create product object
  const product = {
      category: category,
      name: productName,
      price: parseFloat(price).toFixed(2),
      quantity: parseInt(quantity)
  };

  addProductToList(product);
  saveProductToStorage(product); // Save to storage

  // Clear form inputs
  document.getElementById("category").value = "";
  document.getElementById("product-name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("quantity").value = "";
});

// Function to save product to local storage
function saveProductToStorage(product) {
  const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
  storedProducts.push(product);
  localStorage.setItem('products', JSON.stringify(storedProducts));
}

// Function to remove product from local storage
function removeProductFromStorage(product) {
  let storedProducts = JSON.parse(localStorage.getItem('products')) || [];
  storedProducts = storedProducts.filter(p => p.name !== product.name || p.category !== product.category);
  localStorage.setItem('products', JSON.stringify(storedProducts));
}




// Sample data for the chart
const chartData = {
  labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // Days of the week
  datasets: [{
      label: 'Orders',
      data: [5, 10, 8, 12, 15, 9, 14], // Example order counts
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
  }]
};

// Function to initialize the chart
function initializeChart() {
  const ctx = document.getElementById('recentOrdersChart').getContext('2d');
  const recentOrdersChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}

// Example functions to populate income, expenses, and completed orders
function updateDashboard() {
  document.getElementById('income').innerText = '₱500.00'; // Example income
  document.getElementById('expenses').innerText = '₱200.00'; // Example expenses
  document.getElementById('completed-orders').innerText = '25'; // Example completed orders

  // Populate recent orders
  const recentOrdersList = document.getElementById('recent-orders-list');
  for (let i = 1; i <= 5; i++) {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `Order #${i} - ₱${Math.floor(Math.random() * 100 + 1)}`;
      recentOrdersList.appendChild(li);
  }
}

document.getElementById('export-csv').addEventListener('click', () => {
  const rows = [
      ["Order ID", "Date", "Customer Name", "Order Type", "Total Amount", "Status"],
      ["001", "2024-10-23", "John Doe", "Dine In", "₱250.00", "Completed"],
      ["002", "2024-10-22", "Jane Smith", "To Go", "₱150.00", "Completed"],
      // Add more rows dynamically
  ];

  let csvContent = "data:text/csv;charset=utf-8," 
      + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "transaction_history.csv");
  document.body.appendChild(link);
  link.click();
});

document.getElementById('import-csv').addEventListener('click', () => {
  document.getElementById('csv-file').click();
});

document.getElementById('csv-file').addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
      const text = e.target.result;
      console.log(text); // Process the CSV data here
  };

  reader.readAsText(file);
});


// Call updateDashboard to populate data
updateDashboard();