// Initialize cart and total price
let cart = [];
let totalPrice = 0;

// Load categories and products from local storage and populate the select options
function populateCategories(products) {
    const categorySelect = document.getElementById("category");
    const uniqueCategories = [...new Set(products.map(product => product.category))];

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });

    // Event listener for category change to populate products
    categorySelect.addEventListener("change", function() {
        const selectedCategory = this.value;
        const productSelect = document.getElementById("product");
        productSelect.innerHTML = '<option value="">Select a product</option>'; // Reset products

        const filteredProducts = products.filter(product => product.category === selectedCategory);
        filteredProducts.forEach(product => {
            const option = document.createElement("option");
            option.value = product.name;
            option.textContent = product.name;
            productSelect.appendChild(option);
        });
    });
}

// Add to cart functionality
document.getElementById("addToCart").addEventListener("click", function() {
    const productSelect = document.getElementById("product");
    const quantityInput = document.getElementById("quantity");

    const selectedProductName = productSelect.value;
    const selectedQuantity = parseInt(quantityInput.value, 10);

    if (!selectedProductName || selectedQuantity <= 0) {
        alert("Please select a product and a valid quantity.");
        return;
    }

    // Get the selected product details from local storage
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const selectedProduct = storedProducts.find(product => product.name === selectedProductName);

    if (selectedProduct && selectedProduct.quantity >= selectedQuantity) {
        const cartItem = { product: selectedProductName, quantity: selectedQuantity, price: selectedProduct.price };
        cart.push(cartItem);
        totalPrice += selectedProduct.price * selectedQuantity;

        // Update cart display
        const cartItemsList = document.getElementById("cart-items");
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
        listItem.textContent = `${selectedProductName} (Qty: ${selectedQuantity}) - ₱${(selectedProduct.price * selectedQuantity).toFixed(2)}`;

        // Create a Remove button
        const removeButton = document.createElement("button");
        removeButton.className = "btn btn-danger btn-sm";
        removeButton.textContent = "Remove";
        removeButton.onclick = function() {
            // Call the removeItemFromCart function when clicked
            removeItemFromCart(cartItemsList, listItem, selectedProductName, selectedQuantity, selectedProduct.price);
        };

        listItem.appendChild(removeButton);
        cartItemsList.appendChild(listItem);

        // Update total price
        document.getElementById("totalPrice").textContent = `₱${totalPrice.toFixed(2)}`;

        // Deduct quantity from inventory
        selectedProduct.quantity -= selectedQuantity;
        localStorage.setItem('products', JSON.stringify(storedProducts)); // Update the product list in local storage

        // Reset form fields
        productSelect.value = '';
        quantityInput.value = 1;

    } else {
        alert("Insufficient stock for this product.");
    }
});

// Function to remove an item from the cart
function removeItemFromCart(cartItemsList, listItem, productName, quantity, price) {
    // Remove item from cart array
    cart = cart.filter(item => item.product !== productName || item.quantity !== quantity);
    totalPrice -= price * quantity;

    // Remove the list item from the cart display
    cartItemsList.removeChild(listItem);

    // Update total price display
    document.getElementById("totalPrice").textContent = `₱${totalPrice.toFixed(2)}`;
}

// Reset form functionality
document.getElementById("resetForm").addEventListener("click", function() {
    document.getElementById("posForm").reset();
    document.getElementById("cart-items").innerHTML = '';
    totalPrice = 0;
    cart.length = 0;
    document.getElementById("totalPrice").textContent = '₱0.00';
});

// Load recent orders from local storage and display them
// Load recent orders from local storage and display them
function loadRecentOrders() {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const recentOrdersList = document.getElementById('recent-orders');
    recentOrdersList.innerHTML = ''; // Clear existing orders

    // Slice the last 5 transactions
    const recentTransactions = storedTransactions.slice(-5);

    recentTransactions.forEach(transaction => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        
        // Format items without the "Remove" text
        const formattedItems = transaction.items.map(item => {
            return `${item}`; // Assuming the item strings are already formatted as "Product Name (Qty: X) - ₱Y"
        }).join(', '); // Join the items with a comma
        
        li.innerHTML = `
            <strong>Order ID:</strong> ${transaction.id} - 
            <strong>Date:</strong> ${transaction.date} - 
            <strong>Items:</strong> ${formattedItems} - 
            <strong>Type:</strong> ${transaction.orderType} - 
            <strong>Total:</strong> ₱${transaction.totalAmount} - 
            <strong>Status:</strong> ${transaction.status}
            <button class="btn btn-link request-invoice" data-id="${transaction.id}">Request Invoice</button>
        `;
        recentOrdersList.appendChild(li);
    });
}


// Function to generate an invoice
function generateInvoice() {
    const cartItems = document.getElementById('cart-items').children;
    const totalPriceText = document.getElementById('totalPrice').textContent;
    const paymentMethod = document.getElementById('payment-method').value;
    const orderType = document.getElementById('order-type').value;

    if (cartItems.length === 0) {
        alert("No items in the cart to generate an invoice.");
        return;
    }

    let invoiceContent = `<h4>Invoice</h4>`;
    invoiceContent += `<p>Payment Method: ${paymentMethod}</p>`;
    invoiceContent += `<p>Order Type: ${orderType}</p>`;
    invoiceContent += `<table class="table"><thead><tr><th>Item</th><th>Quantity</th><th>Price</th></tr></thead><tbody>`;

    // Loop through cart items to build invoice content
    Array.from(cartItems).forEach(item => {
        const itemText = item.textContent.split(' - ');
        const productName = itemText[0];
        const quantity = itemText[1].split(': ')[1];
        const price = itemText[2];

        invoiceContent += `<tr><td>${productName}</td><td>${quantity}</td><td>${price}</td></tr>`;
    });

    invoiceContent += `</tbody></table>`;
    invoiceContent += `<h5>Total: ${totalPriceText}</h5>`;

    // Display invoice content in modal
    document.getElementById('invoiceContent').innerHTML = invoiceContent;

    // Show the modal
    $('#invoiceModal').modal('show');
}

// Event listener for the request invoice button
document.getElementById('requestInvoice').addEventListener('click', generateInvoice);

// Function to download the invoice as PDF
document.getElementById('downloadInvoice').addEventListener('click', function () {
    const invoiceContent = document.getElementById('invoiceContent').innerHTML;
    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write(`
        <html>
        <head>
            <title>Invoice</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            </style>
        </head>
        <body>${invoiceContent}</body>
        </html>
    `);
    pdfWindow.document.close();
    pdfWindow.focus();
    pdfWindow.print();
    pdfWindow.close();
});

// Update the order now event listener to save order and load recent orders
document.getElementById('orderNow').addEventListener('click', function() {
    const itemsInCart = Array.from(document.querySelectorAll('#cart-items .list-group-item'));
    const orderedItems = itemsInCart.map(item => item.textContent);

    // Create a transaction object
    const transaction = {
        id: `ORD${Date.now()}`, // Unique order ID based on current timestamp
        date: new Date().toISOString().split('T')[0], // Current date
        items: orderedItems, // List of ordered items
        orderType: document.getElementById('order-type').value, // Get order type
        totalAmount: parseFloat(document.getElementById('totalPrice').textContent.replace('₱', '').replace(',', '')).toFixed(2), // Total amount
        status: 'Completed' // Set status of the order
    };

    // Save the transaction
    saveTransaction(transaction);

    // Update recent orders section
    loadRecentOrders();

    // Clear the cart and total price
    document.getElementById('cart-items').innerHTML = '';
    document.getElementById('totalPrice').textContent = '₱0.00';

    // Optionally show a confirmation message
    alert('Order placed successfully!');
});

// Function to save transaction
function saveTransaction(transaction) {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    storedTransactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(storedTransactions));
}

// Load products from local storage
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    populateCategories(products);
}

// Initial call to load products and recent orders
loadProducts();
loadRecentOrders();
