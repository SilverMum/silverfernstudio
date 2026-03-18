// ------------------------------
// PRODUCT RENDERING + CAROUSEL
// ------------------------------

// Assumes `products` array is loaded from products.js

const categoryToContainerId = {
    originals: "originalsContainer",
    prints: "printsContainer",
    stickers: "stickersContainer",
    clothing: "clothingContainer",
    stationery: "stationeryContainer",
    digital: "digitalContainer"
};

function createCard(product) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.productId = product.id;

    // Image/emoji area
    const emojiWrap = document.createElement("div");
    emojiWrap.className = "card-emoji";
    emojiWrap.textContent = product.image || "🖼️";

    const category = document.createElement("p");
    category.className = "card-category";
    category.textContent = product.category;

    const title = document.createElement("h4");
    title.className = "card-title";
    title.textContent = product.title;

    const details = document.createElement("p");
    details.className = "card-details";
    details.textContent = product.details;

    const price = document.createElement("p");
    price.className = "card-price";
    price.textContent = `$${product.price.toFixed(2)}`;

    // Overlay + VIEW button
    const overlay = document.createElement("div");
    overlay.className = "card-overlay";

    const viewBtn = document.createElement("button");
    viewBtn.className = "view-btn";
    viewBtn.textContent = "VIEW";

    overlay.appendChild(viewBtn);

    card.appendChild(emojiWrap);
    card.appendChild(category);
    card.appendChild(title);
    card.appendChild(details);
    card.appendChild(price);
    card.appendChild(overlay);

    // Clicking anywhere on card or VIEW opens modal
    card.addEventListener("click", () => openProductModal(product));

    return card;
}

function renderProductsIntoCarousels() {
    Object.keys(categoryToContainerId).forEach(category => {
        const containerId = categoryToContainerId[category];
        const outerTrack = document.getElementById(containerId);
        if (!outerTrack) return;

        // Create inner track for sliding
        const innerTrack = document.createElement("div");
        innerTrack.className = "carousel-track-inner";

        const items = products.filter(p => p.category === category);
        items.forEach(product => {
            const card = createCard(product);
            innerTrack.appendChild(card);
        });

        outerTrack.innerHTML = "";
        outerTrack.appendChild(innerTrack);
    });
}

// ------------------------------
// PRODUCT MODAL LOGIC
// ------------------------------

const modal = document.getElementById("productModal");
const closeModalBtn = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const emojiFallback = document.getElementById("emojiFallback");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDetails = document.getElementById("modalDetails");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");

let currentProduct = null;

function openProductModal(product) {
    currentProduct = product;

    modalCategory.textContent = product.category;
    modalTitle.textContent = product.title;
    modalDetails.textContent = product.details;
    modalPrice.textContent = `$${product.price.toFixed(2)}`;
    modalDescription.textContent = product.description;

    // ------------------------------
    // EMOJI FALLBACK LOGIC
    // ------------------------------
    if (!product.image || product.image.length < 3) {
        modalImage.classList.add("hidden");
        emojiFallback.classList.remove("hidden");
        emojiFallback.textContent = product.image || "🖼️";
    } else {
        emojiFallback.classList.add("hidden");
        modalImage.classList.remove("hidden");
        modalImage.src = product.image;
        modalImage.alt = product.title;
    }

    modal.classList.remove("hidden");
}

function closeProductModal() {
    modal.classList.add("hidden");
    currentProduct = null;
}

if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeProductModal);
}

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeProductModal();
    }
});

// ------------------------------
// CART PANEL TOGGLE
// ------------------------------

const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const closeCartButton = document.getElementById("closeCart");

if (cartButton && cartPanel) {
    cartButton.addEventListener("click", () => {
        cartPanel.classList.remove("hidden");
    });
}

if (closeCartButton && cartPanel) {
    closeCartButton.addEventListener("click", () => {
        cartPanel.classList.add("hidden");
    });
}

// ------------------------------
// CONTACT MODAL LOGIC
// ------------------------------

const contactButton = document.getElementById("contactButton");
const contactModal = document.getElementById("contactModal");
const closeContact = document.getElementById("closeContact");

if (contactButton && contactModal) {
    contactButton.addEventListener("click", () => {
        contactModal.classList.remove("hidden");
    });
}

if (closeContact && contactModal) {
    closeContact.addEventListener("click", () => {
        contactModal.classList.add("hidden");
    });
}

contactModal.addEventListener("click", (e) => {
    if (e.target === contactModal) {
        contactModal.classList.add("hidden");
    }
});

// ------------------------------
// CONTACT FORM EMAIL SEND
// ------------------------------

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("contactName").value;
        const email = document.getElementById("contactEmail").value;
        const message = document.getElementById("contactMessage").value;

        const mailtoLink = `mailto:YOUR_EMAIL_HERE?subject=Message from ${encodeURIComponent(name)}&body=Email: ${encodeURIComponent(email)}%0D%0A%0D%0A${encodeURIComponent(message)}`;

        window.location.href = mailtoLink;

        contactModal.classList.add("hidden");
    });
}

// ------------------------------
// CART FUNCTIONALITY
// ------------------------------

let cart = [];

function updateCartUI() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `<p class="empty-cart">Your cart is empty</p>`;
        cartTotal.textContent = "$0.00";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-title">${item.title}</span>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            </div>
            <button class="remove-item" data-index="${index}">✖</button>
        `;

        cartItems.appendChild(div);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Remove item buttons
    document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            updateCartUI();
        });
    });
}

// ADD TO CART BUTTON
const addToCartBtn = document.getElementById("addToCart");

if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
        if (currentProduct) {
            cart.push(currentProduct);
            updateCartUI();
            cartPanel.classList.remove("hidden");
        }
    });
}

// ------------------------------
// CAROUSEL LOGIC
// ------------------------------

function setupCarousels() {
    const wrappers = document.querySelectorAll(".carousel-wrapper");

    wrappers.forEach(wrapper => {
        const leftArrow = wrapper.querySelector(".carousel-arrow-left");
        const rightArrow = wrapper.querySelector(".carousel-arrow-right");
        const track = wrapper.querySelector(".carousel-track");
        const innerTrack = track.querySelector(".carousel-track-inner");

        if (!innerTrack) return;

        let currentIndex = 0;

        function getCardWidth() {
            const firstCard = innerTrack.querySelector(".card");
            if (!firstCard) return 0;
            const style = window.getComputedStyle(firstCard);
            const width = firstCard.getBoundingClientRect().width;
            const marginRight = parseFloat(style.marginRight) || 0;
            return width + marginRight;
        }

        function getVisibleCount() {
            const trackWidth = track.getBoundingClientRect().width;
            const cardWidth = getCardWidth();
            if (!cardWidth) return 1;
            return Math.max(1, Math.floor(trackWidth / cardWidth));
        }

        function updateArrows() {
            const totalCards = innerTrack.querySelectorAll(".card").length;
            const visibleCount = getVisibleCount();
            const maxIndex = Math.max(0, totalCards - visibleCount);

            if (currentIndex <= 0) {
                currentIndex = 0;
                leftArrow.classList.add("disabled");
            } else {
                leftArrow.classList.remove("disabled");
            }

            if (currentIndex >= maxIndex) {
                currentIndex = maxIndex;
                rightArrow.classList.add("disabled");
            } else {
                rightArrow.classList.remove("disabled");
            }
        }

        function updatePosition() {
            const cardWidth = getCardWidth();
            const offset = -(currentIndex * cardWidth);
            innerTrack.style.transform = `translateX(${offset}px)`;
            updateArrows();
        }

        leftArrow.addEventListener("click", () => {
            if (leftArrow.classList.contains("disabled")) return;
            const visibleCount = getVisibleCount();
            currentIndex -= visibleCount;
            if (currentIndex < 0) currentIndex = 0;
            updatePosition();
        });

        rightArrow.addEventListener("click", () => {
            if (rightArrow.classList.contains("disabled")) return;
            const visibleCount = getVisibleCount();
            const totalCards = innerTrack.querySelectorAll(".card").length;
            const maxIndex = Math.max(0, totalCards - visibleCount);
            currentIndex += visibleCount;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            updatePosition();
        });

        window.addEventListener("resize", () => {
            updatePosition();
        });

        updatePosition();
    });
}

// ------------------------------
// INIT
// ------------------------------

document.addEventListener("DOMContentLoaded", () => {
    renderProductsIntoCarousels();
    setupCarousels();
});
