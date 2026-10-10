"use strict";

// =====================================
// KFC x SPRITE - WEBSITE JAVASCRIPT
// =====================================

// PRODUCT DATA
// Prices are for this demo project only.

const products = {
    chicken: {
        name: "Crispy Chicken Bucket",
        price: 299
    },

    burger: {
        name: "Classic Chicken Burger",
        price: 179
    },

    strips: {
        name: "Crispy Chicken Strips",
        price: 199
    },

    sprite: {
        name: "Sprite Can",
        price: 60
    },

    meal: {
        name: "Burger Meal + Sprite",
        price: 249
    },

    combo: {
        name: "Chicken + Sprite Combo",
        price: 329
    }
};

// SHOPPING CART
const cart = {};

// HTML ELEMENTS
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const itemCount = document.getElementById("itemCount");

const subtotalElement = document.getElementById("subtotal");
const deliveryElement = document.getElementById("delivery");
const totalElement = document.getElementById("total");

const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutMessage = document.getElementById("checkoutMessage");
const toast = document.getElementById("toast");

let toastTimer;


// FORMAT PRICE
function formatPrice(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}


// SHOW NOTIFICATION
function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 2200);
}


// GET TOTAL QUANTITY
function getTotalQuantity() {
    return Object.values(cart).reduce(function (sum, quantity) {
        return sum + quantity;
    }, 0);
}


// ADD PRODUCT TO CART
function addToCart(productId) {
    if (!products[productId]) {
        return;
    }

    cart[productId] = (cart[productId] || 0) + 1;

    renderCart();

    checkoutMessage.textContent = "";

    showToast(products[productId].name + " added to your bag!");
}


// CHANGE QUANTITY
function changeQuantity(productId, amount) {
    if (!products[productId]) {
        return;
    }

    const nextQuantity = (cart[productId] || 0) + amount;

    if (nextQuantity <= 0) {
        delete cart[productId];
    } else {
        cart[productId] = nextQuantity;
    }

    renderCart();

    checkoutMessage.textContent = "";
}


// REMOVE PRODUCT
function removeFromCart(productId) {
    if (!products[productId]) {
        return;
    }

    delete cart[productId];

    renderCart();

    checkoutMessage.textContent = "";

    showToast("Item removed from your bag.");
}


// RENDER CART
function renderCart() {
    const ids = Object.keys(cart);
    const quantity = getTotalQuantity();

    cartCount.textContent = quantity;
    itemCount.textContent = "(" + quantity + ")";

    // EMPTY CART
    if (ids.length === 0) {
        cartItems.replaceChildren();

        const emptyMessage = document.createElement("p");

        emptyMessage.className = "empty-cart";
        emptyMessage.textContent =
            "Your bag is empty. Add something delicious!";

        cartItems.appendChild(emptyMessage);

        subtotalElement.textContent = formatPrice(0);
        deliveryElement.textContent = formatPrice(0);
        totalElement.textContent = formatPrice(0);

        checkoutBtn.disabled = true;

        return;
    }

    let subtotal = 0;

    cartItems.replaceChildren();

    // CREATE EACH CART ITEM
    ids.forEach(function (id) {
        const product = products[id];
        const qty = cart[id];

        const lineTotal = product.price * qty;

        subtotal += lineTotal;

        const item = document.createElement("div");
        item.className = "cart-item";

        const details = document.createElement("div");

        const title = document.createElement("h4");
        title.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(product.price) + " each";

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        // DECREASE BUTTON
        const decrease = document.createElement("button");

        decrease.type = "button";
        decrease.textContent = "−";
        decrease.setAttribute(
            "aria-label",
            "Decrease " + product.name
        );

        decrease.addEventListener("click", function () {
            changeQuantity(id, -1);
        });

        // QUANTITY DISPLAY
        const quantityLabel = document.createElement("span");

        quantityLabel.textContent = qty;

        // INCREASE BUTTON
        const increase = document.createElement("button");

        increase.type = "button";
        increase.textContent = "+";
        increase.setAttribute(
            "aria-label",
            "Increase " + product.name
        );

        increase.addEventListener("click", function () {
            changeQuantity(id, 1);
        });

        // REMOVE BUTTON
        const remove = document.createElement("button");

        remove.type = "button";
        remove.className = "remove";
        remove.textContent = "Remove";

        remove.addEventListener("click", function () {
            removeFromCart(id);
        });

        // ASSEMBLE CONTROLS
        controls.append(
            decrease,
            quantityLabel,
            increase,
            remove
        );

        details.append(title, price, controls);

        const linePrice = document.createElement("span");

        linePrice.className = "item-total";
        linePrice.textContent = formatPrice(lineTotal);

        item.append(details, linePrice);

        cartItems.append(item);
    });

    // DEMO DELIVERY CHARGE
    const delivery = subtotal > 0 ? 30 : 0;

    const total = subtotal + delivery;

    // UPDATE BILL
    subtotalElement.textContent = formatPrice(subtotal);
    deliveryElement.textContent = formatPrice(delivery);
    totalElement.textContent = formatPrice(total);

    checkoutBtn.disabled = false;
}


// ADD-TO-CART BUTTONS
document.querySelectorAll(".add-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        addToCart(button.dataset.id);
    });
});


// PRODUCT CATEGORY FILTERS
const filterButtons = document.querySelectorAll(".filter-btn");

const productCards = document.querySelectorAll(".product");

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const selected = button.dataset.filter;

        filterButtons.forEach(function (filter) {
            filter.classList.remove("active");
            filter.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        productCards.forEach(function (card) {
            const matches =
                selected === "all" ||
                card.dataset.category === selected;

            card.hidden = !matches;
        });
    });
});


// MOBILE NAVIGATION
const menuToggle = document.getElementById("menuToggle");

const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.textContent = isOpen ? "✕" : "☰";

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
    );
});


// CLOSE MOBILE MENU AFTER CLICKING A LINK
navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("open");

        menuToggle.textContent = "☰";

        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.setAttribute("aria-label", "Open navigation");
    });
});


// HEADER CART BUTTON
document.getElementById("headerCart").addEventListener(
    "click",
    function () {
        document.getElementById("cart").scrollIntoView({
            behavior: "smooth"
        });
    }
);


// DEMO CHECKOUT
checkoutBtn.addEventListener("click", function () {
    const quantity = getTotalQuantity();

    if (quantity === 0) {
        checkoutMessage.textContent =
            "Add an item to your bag before continuing.";

        return;
    }

    checkoutMessage.textContent =
        "Demo checkout ready! Your estimated total is " +
        totalElement.textContent +
        ". No real order or payment has been made.";

    showToast("Demo checkout is ready!");
});


// AUTOMATIC FOOTER YEAR
document.getElementById("year").textContent =
    new Date().getFullYear();


// INITIAL CART DISPLAY
renderCart();

console.log("KFC x Sprite website loaded successfully!");