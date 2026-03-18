// ------------------------------
// PRODUCT RENDERING + CAROUSEL
// ------------------------------

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

    const emojiWrap = document.createElement("div");
    emojiWrap.className = "card-emoji";
    emojiWrap.textContent = product.image;

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

    card.addEventListener("click", () => openProductModal(product));

    return card;
}

function renderProductsIntoCarousels() {
    Object.keys(categoryToContainerId).forEach(category => {
        const container = document.getElementById(categoryToContainerId[category]);
        const innerTrack = document.createElement("div");
        innerTrack.className = "carousel-track-inner";

        products.filter(p => p.category === category).forEach(product => {
            innerTrack.appendChild(createCard(product));
        });

        container.innerHTML = "";
        container.appendChild(innerTrack);
    });
}

// ------------------------------
// PRODUCT MODAL
// ------------------------------

const modal = document.getElementById("productModal");
const emojiFallback = document.getElementById("emojiFallback");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDetails = document.getElementById("modalDetails");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const continueBrowsingBtn = document.getElementById("continueBrowsing");

let currentProduct = null;

function openProductModal(product) {
    currentProduct = product;

    modalCategory.textContent = product.category;
    modalTitle.textContent = product.title;
    modalDetails.textContent = product.details;
    modalPrice.textContent = `$${product.price.toFixed(2)}`;
    modalDescription.textContent = product.description;

    emojiFallback.textContent = product.image;

    modal.classList.remove("hidden");
}

function closeProductModal() {
    modal.classList.add("hidden");
    currentProduct = null;
}

continueBrowsingBtn.addEventListener("click", closeProductModal);

modal.addEventListener("click", e => {
    if (e.target === modal) closeProductModal();
});

// ------------------------------
// CONTACT MODAL
// ------------------------------

const contactButton = document.getElementById("contactButton");
const contactModal = document.getElementById("contactModal");
const closeContact = document.getElementById("closeContact");

contactButton.addEventListener("click", () => contactModal.classList.remove("hidden"));
closeContact.addEventListener("click", () => contactModal.classList.add("hidden"));

contactModal.addEventListener("click", e => {
    if (e.target === contactModal) contactModal.classList.add("hidden");
});

// ------------------------------
// CONTACT FORM
// ------------------------------

document.getElementById("contactForm").addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("contactName").value;
    const email = document.getElementById("contactEmail").value;
    const message = document.getElementById("contactMessage").value;

    window.location.href =
        `mailto:YOUR_EMAIL_HERE?subject=Message from ${encodeURIComponent(name)}&body=Email: ${encodeURIComponent(email)}%0D%0A%0D%0A${encodeURIComponent(message)}`;

    contactModal.classList.add("hidden");
});

// ------------------------------
// CART
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

    document.querySelectorAll(".remove-item").forEach(btn => {
        btn.addEventListener("click", e => {
            cart.splice(e.target.dataset.index, 1);
            updateCartUI();
        });
    });
}

document.getElementById("addToCart").addEventListener("click", () => {
    if (currentProduct) {
        cart.push(currentProduct);
        updateCartUI();
        document.getElementById("cartPanel").classList.remove("hidden");
    }
});

// ------------------------------
// CART PANEL
// ------------------------------

document.getElementById("cartButton").addEventListener("click", () =>
    document.getElementById("cartPanel").classList.remove("hidden")
);

document.getElementById("closeCart").addEventListener("click", () =>
    document.getElementById("cartPanel").classList.add("hidden")
);

// ------------------------------
// CAROUSEL
// ------------------------------

function setupCarousels() {
    document.querySelectorAll(".carousel-wrapper").forEach(wrapper => {
        const leftArrow = wrapper.querySelector(".carousel-arrow-left");
        const rightArrow = wrapper.querySelector(".carousel-arrow-right");
        const track = wrapper.querySelector(".carousel-track");
        const innerTrack = track.querySelector(".carousel-track-inner");

        let currentIndex = 0;

        function getCardWidth() {
            const firstCard = innerTrack.querySelector(".card");
            if (!firstCard) return 0;
            const style = window.getComputedStyle(firstCard);
            return firstCard.getBoundingClientRect().width + parseFloat(style.marginRight);
        }

        function getVisibleCount() {
            const trackWidth = track.getBoundingClientRect().width;
            const cardWidth = getCardWidth();
            return Math.max(1, Math.floor(trackWidth / cardWidth));
        }

        function updateArrows() {
            const totalCards = innerTrack.querySelectorAll(".card").length;
            const visibleCount = getVisibleCount();
            const maxIndex = Math.max(0, totalCards - visibleCount);

            leftArrow.classList.toggle("disabled", currentIndex <= 0);
            rightArrow.classList.toggle("disabled", currentIndex >= maxIndex);
        }

        function updatePosition() {
            innerTrack.style.transform = `translateX(${-currentIndex * getCardWidth()}px)`;
            updateArrows();
        }

        leftArrow.addEventListener("click", () => {
            if (!leftArrow.classList.contains("disabled")) {
                currentIndex = Math.max(0, currentIndex - getVisibleCount());
                updatePosition();
            }
        });

        rightArrow.addEventListener("click", () => {
            if (!rightArrow.classList.contains("disabled")) {
                const totalCards = innerTrack.querySelectorAll(".card").length;
                const visibleCount = getVisibleCount();
                const maxIndex = Math.max(0, totalCards - visibleCount);
                currentIndex = Math.min(maxIndex, currentIndex + visibleCount);
                updatePosition();
            }
        });

        window.addEventListener("resize", updatePosition);

        updatePosition();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderProductsIntoCarousels();
    setupCarousels();
});
