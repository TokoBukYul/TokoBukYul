// Data Produk Toko Kelontong
const products = [
  {
    id: 1,
    name: "Minyak Goreng Bimoli 1L",
    category: "sembako",
    price: 18500,
    unit: "Pouch 1 Liter",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKCNTcOeK9_L2bXTYeHzwlzJeVoGpKUOiiWH86oePa8WAq8vE2ti7JCDs&s=10"
  },
  {
    id: 2,
    name: "Beras Sentra Ramos 5kg",
    category: "sembako",
    price: 68000,
    unit: "Karung 5kg",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    name: "Indomie Goreng",
    category: "makanan",
    price: 3100,
    unit: "Bungkus 85g",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 4,
    name: "Gula Pasir Gulaku 1kg",
    category: "sembako",
    price: 16500,
    unit: "Bungkus 1kg",
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 5,
    name: "Teh Botol Sosro 450ml",
    category: "minuman",
    price: 6000,
    unit: "Botol PET",
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 6,
    name: "Kecap Manis Bango 520ml",
    category: "bumbu",
    price: 24000,
    unit: "Pouch Refill",
    image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 7,
    name: "Sabun Cuci Piring Mama Lemon 780ml",
    category: "kebersihan",
    price: 13500,
    unit: "Pouch Refill",
    image: "https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 8,
    name: "Kopi Kapal Api Spesial Mix 10x25g",
    category: "minuman",
    price: 14500,
    unit: "Renceng (10 sachet)",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80"
  }
];

// Nomor WhatsApp Toko (Ubah sesuai nomor toko kamu)
const STORE_PHONE_NUMBER = "6281234567890";

// State Aplikasi
let cart = [];
let currentCategory = "all";
let searchQuery = "";

// Format Mata Uang
function formatIDR(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}

// Render Produk ke DOM
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const filtered = products.filter((p) => {
    const matchesCat = currentCategory === "all" || p.category === currentCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 20px;">Produk tidak ditemukan.</p>`;
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div>
        <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
        <h3 class="product-title">${product.name}</h3>
        <p class="product-unit">${product.unit}</p>
      </div>
      <div class="product-bottom">
        <span class="product-price">${formatIDR(product.price)}</span>
        <button class="add-btn" onclick="addToCart(${product.id})">+ Tambah</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Tambah Produk ke Keranjang
function addToCart(productId) {
  const itemInCart = cart.find((item) => item.id === productId);
  if (itemInCart) {
    itemInCart.qty += 1;
  } else {
    const product = products.find((p) => p.id === productId);
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
}

// Ubah Quantity Produk
function updateQty(productId, change) {
  const itemIndex = cart.findIndex((item) => item.id === productId);
  if (itemIndex > -1) {
    cart[itemIndex].qty += change;
    if (cart[itemIndex].qty <= 0) {
      cart.splice(itemIndex, 1);
    }
  }
  updateCartUI();
}

// Update Tampilan Keranjang
function updateCartUI() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartBadge = document.getElementById("cartBadge");
  const cartTotal = document.getElementById("cartTotal");

  // Total item count
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  cartBadge.textContent = totalItems;

  // Render items
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Keranjang belanja Anda masih kosong.</p>`;
    cartTotal.textContent = formatIDR(0);
    return;
  }

  let totalSum = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.qty;
    totalSum += itemTotal;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${formatIDR(item.price)} x ${item.qty} = <strong>${formatIDR(itemTotal)}</strong></p>
      </div>
      <div class="cart-controls">
        <button onclick="updateQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="updateQty(${item.id}, 1)">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  cartTotal.textContent = formatIDR(totalSum);
}

// Kirim Pesanan via WhatsApp
function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Keranjang Anda masih kosong!");
    return;
  }

  const name = document.getElementById("custName").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const payment = document.getElementById("payMethod").value;

  if (!name || !address) {
    alert("Mohon isi Nama dan Alamat lengkap!");
    return;
  }

  let text = `Halo *KelontongKu*, saya ingin memesan barang berikut:\n\n`;

  let grandTotal = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    grandTotal += itemTotal;
    text += `${index + 1}. *${item.name}* (${item.qty}x) - ${formatIDR(itemTotal)}\n`;
  });

  text += `\n*Total Belanja:* ${formatIDR(grandTotal)}\n`;
  text += `-----------------------------------\n`;
  text += `*Nama:* ${name}\n`;
  text += `*Alamat:* ${address}\n`;
  text += `*Metode Bayar:* ${payment}\n\n`;
  text += `Mohon segera diproses ya, terima kasih!`;

  const encodedUrl = `https://wa.me/${STORE_PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(encodedUrl, "_blank");
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();

  // Search filter
  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  // Category filter buttons
  document.getElementById("categoryContainer").addEventListener("click", (e) => {
    if (e.target.classList.contains("cat-btn")) {
      document.querySelectorAll(".cat-btn").forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
      currentCategory = e.target.dataset.cat;
      renderProducts();
    }
  });

  // Drawer Toggle
  const overlay = document.getElementById("cartOverlay");
  const drawer = document.getElementById("cartDrawer");

  document.getElementById("openCartBtn").addEventListener("click", () => {
    overlay.classList.add("active");
    drawer.classList.add("active");
  });

  const closeCart = () => {
    overlay.classList.remove("active");
    drawer.classList.remove("active");
  };

  document.getElementById("closeCartBtn").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  // WhatsApp checkout
  document.getElementById("whatsappCheckoutBtn").addEventListener("click", checkoutWhatsApp);
});
                   
