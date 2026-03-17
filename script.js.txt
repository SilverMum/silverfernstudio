// -------------------------------
// CART LOGIC (Your existing setup)
// -------------------------------

let cart = [];

// Load cart from localStorage
function loadCart() {
    const storedCart = localStorage.getItem("cart");
    cart = storedCart ? JSON.parse(storedCart) : [];
    updateCartDisplay();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart UI
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalAmount = document.getElementById("cart-total-amount");

    cartItemsContainer.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");

        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <button class="remove-item" data-index="${index}">Remove</button>
        `;

        cartItemsContainer.appendChild(itemElement);
        total += item.price;
    });

    cartTotalAmount.textContent = `$${total.toFixed(2)}`;

    // Attach remove listeners
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            cart.splice(index, 1);
            saveCart();
            updateCartDisplay();
        });
    });
}

// -------------------------------
// PAYPAL CHECKOUT
// -------------------------------

function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
}

paypal.Buttons({
    style: {
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "paypal"
    },

    createOrder: function (data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: getCartTotal()
                }
            }]
        });
    },

    onApprove: function (data, actions) {
        return actions.order.capture().then(function () {

            // Clear cart after successful payment
            cart = [];
            saveCart();

            // Redirect to thank you page
            window.location.href = "thankyou.html";
        });
    },

    onError: function (err) {
        console.error("PayPal Checkout Error:", err);
        alert("Something went wrong with the payment. Please try again.");
    }

}).render("#paypal-button-container");

// Initialize cart on page load
loadCart();
