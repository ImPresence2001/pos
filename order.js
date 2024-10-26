// Function to load transaction history from local storage
function loadTransactionHistory() {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transactionHistoryTableBody = document.getElementById('transaction-history');
    transactionHistoryTableBody.innerHTML = ''; // Clear existing data

    // Populate the table with transactions
    storedTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.date}</td>
            <td>${transaction.items.join(', ')}</td>
            <td>${transaction.orderType}</td>
            <td>₱${transaction.totalAmount}</td>
            <td>${transaction.status}</td>
            <td><button class="btn btn-primary request-invoice" data-id="${transaction.id}">Request Invoice</button></td>
        `;
        transactionHistoryTableBody.appendChild(row);
    });

    // Attach event listener for each "Request Invoice" button
    document.querySelectorAll('.request-invoice').forEach(button => {
        button.addEventListener('click', function () {
            const transactionId = this.getAttribute('data-id');
            generateInvoice(transactionId);
        });
    });
}

// Function to generate an invoice for a specific transaction
function generateInvoice(transactionId) {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transaction = storedTransactions.find(t => t.id === transactionId);

    if (!transaction) {
        alert("Transaction not found.");
        return;
    }

    let invoiceContent = `<h4>Invoice</h4>`;
    invoiceContent += `<p>Order ID: ${transaction.id}</p>`;
    invoiceContent += `<p>Order Type: ${transaction.orderType}</p>`;
    invoiceContent += `<p>Date: ${transaction.date}</p>`;
    invoiceContent += `<table class="table"><thead><tr><th>Item</th><th>Quantity</th><th>Price</th></tr></thead><tbody>`;

    // Loop through transaction items to build invoice content
    transaction.items.forEach(item => {
        const itemDetails = item.split(' (Qty: ');
        const itemName = itemDetails[0];
        const quantity = itemDetails[1].split(')')[0];
        const price = itemDetails[1].split('- ₱')[1];
        invoiceContent += `<tr><td>${itemName}</td><td>${quantity}</td><td>₱${price}</td></tr>`;
    });

    invoiceContent += `</tbody></table>`;
    invoiceContent += `<h5>Total: ₱${transaction.totalAmount}</h5>`;

    // Display invoice content in a modal or print window
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
}

// Call loadTransactionHistory on page load to display existing transactions
window.onload = function() {
    loadTransactionHistory();
};
