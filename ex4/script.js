const restaurantList = document.getElementById('restaurant-list');
const cartItems = document.getElementById('cart-items');
const totalPriceElem = document.getElementById('total-price');
const searchInput = document.getElementById('search');
const usernameInput = document.getElementById('username');
const greetingElem = document.getElementById('greeting');
let cart = [];

// Sample restaurant data
const restaurants = [
    { id: 1, name: 'Sushi House', image: 'sushi-house.jpg', menu: [{ name: 'California Roll', price: 10 }, { name: 'Tuna Sashimi', price: 15 }] },
    { id: 2, name: 'Taco Place', image: 'taco-place.jpg', menu: [{ name: 'Chicken Taco', price: 5 }, { name: 'Beef Burrito', price: 7 }] },
    { id: 3, name: 'Pasta Bistro', image: 'pasta-bistro.jpg', menu: [{ name: 'Spaghetti Carbonara', price: 11 }, { name: 'Fettuccine Alfredo', price: 10 }] },
    { id: 4, name: 'Curry Corner', image: 'curry-corner.jpg', menu: [{ name: 'Chicken Curry', price: 9 }, { name: 'Paneer Tikka Masala', price: 8 }] },
    { id: 5, name: 'Salad Bar', image: 'salad-bar.jpg', menu: [{ name: 'Caesar Salad', price: 6 }, { name: 'Greek Salad', price: 7 }] },
    { id: 6, name: 'Pizza Paradise', image: 'pizza-paradise.jpg', menu: [{ name: 'Margherita Pizza', price: 12 }, { name: 'Pepperoni Pizza', price: 14 }] },
    { id: 7, name: 'Burger Shack', image: 'burger-shack.jpg', menu: [{ name: 'Cheeseburger', price: 9 }, { name: 'Veggie Burger', price: 8 }] },
    { id: 8, name: 'Seafood Delight', image: 'seafood-delight.jpg', menu: [{ name: 'Grilled Salmon', price: 15 }, { name: 'Shrimp Scampi', price: 14 }] },
];

function displayRestaurants() {
    restaurantList.innerHTML = '';
    restaurants.forEach(restaurant => {
        const div = document.createElement('div');
        div.classList.add('restaurant');
        div.innerHTML = `
            <img loading="lazy" src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
            <h3>${restaurant.name}</h3>
            <h4>Menu</h4>
            <ul>${restaurant.menu.map(item => `
                <li>${item.name} - $${item.price} 
                <button onclick="orderFood('${restaurant.name}', '${item.name}', ${item.price})">Order</button></li>`).join('')}
            </ul>
        `;
        restaurantList.appendChild(div);
    });
}

function orderFood(restaurantName, foodName, price) {
    const existingItem = cart.find(item => item.restaurantName === restaurantName && item.foodName === foodName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ restaurantName, foodName, price, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.foodName} from ${item.restaurantName} (x${item.quantity}) - $${item.price * item.quantity} 
            <button onclick="removeFromCart(${index})">Remove</button>`;
        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });
    totalPriceElem.textContent = total.toFixed(2);
    localStorage.setItem('cart', JSON.stringify(cart)); // Persist cart
    localStorage.setItem('totalPrice', total.toFixed(2)); // Persist total price
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function placeOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before placing an order.');
        return;
    }
    window.location.href = 'payment.html'; // Navigate to payment page
}

function filterRestaurants() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const query = searchInput.value.toLowerCase();
        const filteredRestaurants = restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(query));
        restaurantList.innerHTML = '';
        filteredRestaurants.forEach(restaurant => {
            const div = document.createElement('div');
            div.classList.add('restaurant');
            div.innerHTML = `
                <img loading="lazy" src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
                <h3>${restaurant.name}</h3>
                <h4>Menu</h4>
                <ul>${restaurant.menu.map(item => `
                    <li>${item.name} - $${item.price} 
                    <button onclick="orderFood('${restaurant.name}', '${item.name}', ${item.price})">Order</button></li>`).join('')}
                </ul>
            `;
            restaurantList.appendChild(div);
        });
    }, 300); // Debounce for 300ms
}

function greetUser() {
    const username = usernameInput.value.trim();
    if (username) {
        greetingElem.textContent = `Hello, ${username}!`;
        greetingElem.style.display = 'block';
    } else {
        greetingElem.style.display = 'none';
    }
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}
function redirectToPayment() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before checking out.');
        return;
    }
    
    // Save total price to localStorage to access in the payment.html
    const totalPrice = parseFloat(totalPriceElem.textContent);
    localStorage.setItem('totalPrice', totalPrice);

    // Redirect to the payment page
    window.location.href = 'payment.html';
}

let debounceTimer;
loadCart();
displayRestaurants();
