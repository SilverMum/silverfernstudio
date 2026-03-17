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
// MODAL LOGIC
// ------------------------------

const modal = document.getElementById("productModal");
const closeModalBtn = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
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

    // For now, use emoji as "image"
    modalImage.src = "";
    modalImage.alt = product.title;
    modalImage.textContent = ""; // if you ever swap to real images, adjust here

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
// CART PANEL TOGGLE (existing IDs)
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
            // Recalculate on resize so 5 cards fit cleanly on desktop
            updatePosition();
        });

        // Initial state
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
