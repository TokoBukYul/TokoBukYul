// Data Produk Toko Kelontong
const products = [
  {
    id: 1,
    name: "Minyak Goreng Bimoli 1L",
    category: "sembako",
    price: 18500,
    unit: "1 Liter",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKCNTcOeK9_L2bXTYeHzwlzJeVoGpKUOiiWH86oePa8WAq8vE2ti7JCDs&s=10"
  },
  {
    id: 2,
    name: "Beras Sentra Ramos 5kg",
    category: "sembako",
    price: 68000,
    unit: "Karung 5kg",
    image: "https://coreimages.lottemart.co.id/ord/06/1087953000"
  },
  {
    id: 3,
    name: "Indomie Goreng",
    category: "makanan",
    price: 4000,
    unit: "Bungkus 85g",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFE2ulJ_BOy3kH3SK7EI1PiVQr4_sYhmRex9mPVcSVxvFkXVuEL4oDmP8Z&s=10"
  },
  {
    id: 4,
    name: "Gula Pasir 1kg",
    category: "sembako",
    price: 16500,
    unit: "Bungkus 1kg",
    image: "https://down-id.img.susercontent.com/file/id-11134207-7rbke-m7a43gujxu52dc"
  },
  {
    id: 5,
    name: "Bear brand",
    category: "minuman",
    price: 10000,
    unit: "Kalengan",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW9G4b1eoc2L8bGyEtohwH5E3EmFrpRDhopDe9uQtw1Q&s=10"
  },
  {
    id: 6,
    name: "Kecap Manis Bango 520ml",
    category: "bumbu",
    price: 24000,
    unit: "Pouch Refill",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa8FtNS8Llpk03NtiGv9HeXax4bBWv-kPjcgBONhB5ll5fcUZlEzuAja8&s=10"
  },
  {
    id: 7,
    name: "Sabun Cuci Piring Mama Lemon 780ml",
    category: "kebersihan",
    price: 13500,
    unit: "Pouch Refill",
    image: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//catalog-image/104/MTA-143932496/mama_lemon_mama_lemon_sabun_cuci_piring_-650_ml-_full01_i7j72267.jpg"
  },
  {
    id: 8,
    name: "Kopi Kapal Api",
    category: "minuman",
    price: 14500,
    unit: "per bungkus",
    image: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/89/MTA-180305142/brd-44261_kopi-kapal-api-bubuk-special-60gr_full01-dd222bda.jpg"
  }
];

// Nomor WhatsApp Toko
const STORE_PHONE_NUMBER = "6285204941121";

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

// Hapus Item Langsung dari Keranjang
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
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
        <button class="delete-btn" onclick="removeFromCart(${item.id})" title="Hapus Item">
          <i class="fa-solid fa-trash-can"></i>
        </button>
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

  let text = `Halo *Buk Yul*, saya ingin memesan barang berikut:\n\n`;

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
