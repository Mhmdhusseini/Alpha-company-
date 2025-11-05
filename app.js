const ADMIN = { user: "alpha", pass: "Alph2025" };
const PRODUCTS_KEY = "products";
let allProducts = [];

// تشغيل تلقائي حسب الصفحة
document.addEventListener("DOMContentLoaded", () => {
    allProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]");

    // لو الصفحة Home
    if (document.getElementById("product-list")) {
        initHome();
    }

    // لو الصفحة أدمن
    if (document.getElementById("login-form")) {
        initAdmin();
    }
});

// ======== الـ Home ========
function initHome() {
    if (allProducts.length === 0) {
        allProducts = [
            { name: "مصعد VIP 8 أشخاص", desc: "سرعة 1.6م/ث", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600", price: "280,000 جنيه" },
            { name: "باب أوتوماتيك", desc: "إيطالي", image: "https://images.pexels.com/photos/4506196/pexels-photo-4506196.jpeg?w=600", price: "85,000 جنيه" }
        ];
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(allProducts));
    }
    renderProducts(allProducts);
    document.getElementById("search")?.addEventListener("input", () => {
        const q = document.getElementById("search").value.toLowerCase();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(q) || (p.desc && p.desc.toLowerCase().includes(q)));
        renderProducts(filtered);
    });
}

function renderProducts(items) {
    const list = document.getElementById("product-list");
    const counter = document.getElementById("counter");
    if (!list) return;

    counter && (counter.innerText = `${items.length} منتج`);
    list.innerHTML = items.map(p => `
        <div class="col">
            <div class="card h-100 shadow">
                <img src="${p.image}" class="card-img-top" alt="${p.name}" style="height:220px;object-fit:cover">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-primary">${p.name}</h5>
                    <p class="text-muted small">${p.desc}</p>
                    <p class="h5 text-success">${p.price}</p>
                    <a href="https://wa.me/201020203040?text=أريد ${p.name}" class="btn btn-success mt-auto">اطلب</a>
                </div>
            </div>
        </div>
    `).join('');
}

// ======== الأدمن ========
function initAdmin() {
    document.getElementById("login-form").addEventListener("submit", e => {
        e.preventDefault();
        const user = document.getElementById("username").value.trim();
        const pass = document.getElementById("password").value;
        if (user === ADMIN.user && pass === ADMIN.pass) {
            document.getElementById("login-box").classList.add("d-none");
            document.getElementById("admin-panel").classList.remove("d-none");
            loadAdmin();
        } else {
            alert("اسم المستخدم أو كلمة المرور خطأ");
        }
    });

    document.getElementById("add-form").addEventListener("submit", e => {
        e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const image = document.getElementById("image").value.trim();
        const desc = document.getElementById("desc").value.trim();
        const price = document.getElementById("price").value.trim();

        if (!name || !image) return alert("الاسم + الصورة مطلوبين");

        allProducts.push({ name, image, desc, price });
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(allProducts));
        e.target.reset();
        loadAdmin();
        alert("تم! ارجع Home واضغط F5");
    });
}

function loadAdmin() {
    const list = document.getElementById("admin-list");
    list.innerHTML = allProducts.map((p, i) => `
        <li class="list-group-item d-flex justify-content-between align-items-center p-3 bg-white shadow-sm rounded mb-2">
            <div>
                <strong>${p.name}</strong><br>
                <small class="text-muted">${p.desc || "لا وصف"} - ${p.price || "لا سعر"}</small>
            </div>
            <div>
                <button class="btn btn-sm btn-warning" onclick="editProduct(${i})">تعديل</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${i})">حذف</button>
            </div>
        </li>
    `).join('');
}

window.editProduct = function(i) {
    const p = allProducts[i];
    const n = prompt("الاسم:", p.name);
    const d = prompt("الوصف:", p.desc);
    const img = prompt("الصورة:", p.image);
    const pr = prompt("السعر:", p.price);
    if (n && img) {
        allProducts[i] = { name: n, desc: d || "", image: img, price: pr || "" };
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(allProducts));
        loadAdmin();
    }
};

window.deleteProduct = function(i) {
    if (confirm("متأكد؟")) {
        allProducts.splice(i, 1);
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(allProducts));
        loadAdmin();
    }

};
