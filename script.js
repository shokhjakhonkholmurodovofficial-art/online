// CONFIG: Telegram Bot Ma'lumotlari
const BOT_TOKEN = '8458935867:AAH4Mc_qcaNAsneat-OEA6q2d01zAXEIY0o';
const ADMIN_ID = '8587974981';

// Mahsulotlar Ro'yxati
const products = [
    { id: 1, name: 'iPhone 15 Pro Max', price: 14500000, img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400' },
    { id: 2, name: 'MacBook Pro 16 M3', price: 28000000, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
    { id: 3, name: 'Sony WH-1000XM5', price: 4200000, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    { id: 4, name: 'Apple Watch Ultra 2', price: 9200000, img: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400' },
    { id: 5, name: 'Samsung S24 Ultra', price: 13500000, img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400' },
    { id: 6, name: 'iPad Pro 12.9', price: 11800000, img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400' }
];

// LocalStorage'dan savatchani olish
function getCart() {
    return JSON.parse(localStorage.getItem('cart_items')) || [];
}

// LocalStorage'ga savatchani saqlash
function saveCart(cart) {
    localStorage.setItem('cart_items', JSON.stringify(cart));
    updateCartBadge();
}

// Navbardagi savatcha sonini yangilash
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const cart = getCart();
        const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
        badge.innerText = totalCount;
    }
}

// ------------------- PAGE 1: INDEX.HTML LOGIKASI -------------------
function renderProducts() {
    const grid = document.getElementById('product-list');
    if (!grid) return;

    grid.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}">
            <div class="product-details">
                <div class="product-title">${p.name}</div>
                <div class="product-price">${p.price.toLocaleString()} so'm</div>
                <button class="btn btn-block" onclick="addToCart(${p.id})">
                    <i class="fa-solid fa-cart-plus"></i> Savatga qo'shish
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function addToCart(productId) {
    let cart = getCart();
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.qty += 1;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({ ...product, qty: 1 });
    }

    saveCart(cart);
    alert("Mahsulot savatga qo'shildi!");
}

// ------------------- PAGE 2: CART.HTML LOGIKASI -------------------
function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    const cart = getCart();
    container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 20px;">Savatchangiz bo\'sh.</p>';
        document.getElementById('summary-count').innerText = '0 ta';
        document.getElementById('summary-price').innerText = '0 so\'m';
        const checkoutLink = document.getElementById('checkout-link');
        if (checkoutLink) checkoutLink.classList.add('disabled');
        return;
    }

    let totalSum = 0;
    let totalCount = 0;

    cart.forEach(item => {
        totalSum += item.price * item.qty;
        totalCount += item.qty;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price.toLocaleString()} so'm</p>
            </div>
            <div class="qty-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <span><b>${item.qty}</b></span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
            <button class="btn btn-danger" onclick="removeFromCart(${item.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        container.appendChild(div);
    });

    document.getElementById('summary-count').innerText = `${totalCount} ta`;
    document.getElementById('summary-price').innerText = `${totalSum.toLocaleString()} so'm`;
    
    const checkoutLink = document.getElementById('checkout-link');
    if (checkoutLink) checkoutLink.classList.remove('disabled');
}

function changeQty(id, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    saveCart(cart);
    renderCartPage();
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCartPage();
}

// ------------------- PAGE 3: CHECKOUT.HTML LOGIKASI -------------------
function renderCheckoutPage() {
    const list = document.getElementById('checkout-items-list');
    if (!list) return;

    const cart = getCart();
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }

    list.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        const itemDiv = document.createElement('div');
        itemDiv.style.display = 'flex';
        itemDiv.style.justifyContent = 'space-between';
        itemDiv.style.marginBottom = '5px';
        itemDiv.style.fontSize = '14px';
        itemDiv.innerHTML = `<span>${item.name} x ${item.qty}</span> <span>${(item.price * item.qty).toLocaleString()} so'm</span>`;
        list.appendChild(itemDiv);
    });

    document.getElementById('checkout-total-price').innerText = `${total.toLocaleString()} so'm`;
}

// Formani topshirish va Telegram Botga yuborish
const orderForm = document.getElementById('order-form');
if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerText = 'Yuborilmoqda...';

        const name = document.getElementById('fullname').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const comment = document.getElementById('comment').value || "Yo'q";

        const cart = getCart();
        let itemsText = '';
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const sum = item.price * item.qty;
            totalPrice += sum;
            itemsText += `\n${index + 1}. *${item.name}* — ${item.qty} ta x ${item.price.toLocaleString()} = *${sum.toLocaleString()} so'm*`;
        });

        // Telegram xabar matni
        const messageText = 
`🛍 *YANGI BUYURTMA!*

👤 *Mijoz:* ${name}
📞 *Tel:* ${phone}
📍 *Manzil:* ${address}
💬 *Izoh:* ${comment}

📦 *Mahsulotlar:*
${itemsText}

💰 *Jami Summa:* ${totalPrice.toLocaleString()} so'm`;

        // Telegram API orqali yuborish
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: ADMIN_ID,
                text: messageText,
                parse_mode: 'Markdown'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert('Buyurtmangiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');
                localStorage.removeItem('cart_items');
                window.location.href = 'index.html';
            } else {
                alert('Xatolik yuz berdi. Qayta urinib ko\'ring.');
                submitBtn.disabled = false;
                submitBtn.innerText = 'Buyurtmani Tasdiqlash';
            }
        })
        .catch(err => {
            console.error(err);
            alert('Tarmoqda xatolik yuz berdi!');
            submitBtn.disabled = false;
            submitBtn.innerText = 'Buyurtmani Tasdiqlash';
        });
    });
}

// Dasturni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    renderProducts();
    renderCartPage();
    renderCheckoutPage();
});