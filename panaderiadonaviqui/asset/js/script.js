const menuData = [
    {
        id: 1,
        cat: "Bizcochos",
        nom: "Bizcocho de Vainilla",
        desc: "Tradicional bizcocho suave con aroma a vainilla, ideal para el café.",
        precio: 7,
        img: "img/m1.png",
    },
    {
        id: 2,
        cat: "Bizcochos",
        nom: "Bizcocho de Chocolate",
        desc: "Bizcocho esponjoso elaborado con cacao selecto y chispas de chocolate.",
        precio: 8,
        img: "img/m1.png",
    },
    {
        id: 3,
        cat: "Bizcochos",
        nom: "Bizcocho Marmolado",
        desc: "Mezcla perfecta de vainilla y chocolate en un horneado artesanal.",
        precio: 13,
        img: "img/m1.png",
    },
    {
        id: 4,
        cat: "Bizcochos",
        nom: "Bizcocho de Naranja",
        desc: "Elaborado con jugo natural de naranja y ralladura fresca.",
        precio: 14,
        img: "img/m1.png",
    },
    {
        id: 5,
        cat: "Bizcochos",
        nom: "Bizcocho Especial",
        desc: "Receta de la casa con frutos secos y un toque de canela.",
        precio: 15,
        img: "img/m1.png",
    },
    {
        id: 6,
        cat: "Empanadas",
        nom: "Empanada Especial de Queso",
        desc: "Masa crujiente rellena de abundante queso derretido.",
        precio: 10,
        img: "img/m2.png",
    },
    {
        id: 7,
        cat: "Empanadas",
        nom: "Empanada de Mortadela",
        desc: "Rellena de mortadela premium y un toque de salsa especial.",
        precio: 10,
        img: "img/m2.png",
    },
    {
        id: 8,
        cat: "Empanadas",
        nom: "Empanada de Queso Simple",
        desc: "La clásica empanada de queso horneada al punto exacto.",
        precio: 5,
        img: "img/m2.png",
    },
    {
        id: 9,
        cat: "Empanadas",
        nom: "Empanada Picante",
        desc: "Relleno sazonado con ajíes tradicionales y carne seleccionada.",
        precio: 5,
        img: "img/m2.png",
    },
    {
        id: 10,
        cat: "Galletas",
        nom: "Galletas de Coco",
        desc: "Galletas crocantes con coco rallado natural.",
        precio: 4,
        img: "img/m3.png",
    },
    {
        id: 21,
        cat: "Especial",
        nom: "Pan Especial",
        desc: "Pan artesanal de corteza crujiente y miga suave.",
        precio: 3,
        img: "img/m4.png",
    },
];

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    renderMenu("Bizcochos");
    setupCategoryTabs();
    verificarHorario();
    
    const categorias = [...new Set(menuData.map(item => item.cat))];
    categorias.forEach(c => preloadImages(c));
});

function preloadImages(categoria) {
    const filtrados = menuData.filter(item => item.cat === categoria);
    filtrados.forEach(item => {
        const img = new Image();
        img.src = item.img;
    });
}

function renderMenu(categoria) {
    const container = document.getElementById("product-list");
    const title = document.querySelector(".category-title");
    if (title) title.innerText = categoria;
    
    container.innerHTML = "";

    const normalize = (text) => text.toLowerCase().trim().replace(/s$/, "");
    const filtrados = menuData.filter(
        (item) => normalize(item.cat) === normalize(categoria)
    );

    if (filtrados.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:20px; color:var(--text-muted);">Próximamente...</p>`;
        return;
    }

    const fragment = document.createDocumentFragment();

    filtrados.forEach((item) => {
        const productCard = document.createElement("div");
        productCard.className = "product-item";
        productCard.innerHTML = `
            <div class="img-placeholder">
                <img src="${item.img}" 
                     class="prod-img" 
                     alt="${item.nom}" 
                     loading="lazy"
                     onload="this.parentElement.classList.add('loaded')"
                     onerror="this.src=''">
            </div>
            <div class="prod-info">
                <div>
                    <h3>${item.nom}</h3>
                    <p>${item.desc}</p>
                </div>
                <div class="prod-price-row">
                    <span class="price">Bs. ${Math.floor(item.precio)}</span>
                    <button class="add-btn" onclick="addToCart(${item.id})">AGREGAR</button>
                </div>
            </div>
        `;
        fragment.appendChild(productCard);
    });
    
    container.appendChild(fragment);
}

function setupCategoryTabs() {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            const nombreCategoria = tab.innerText.trim();
            renderMenu(nombreCategoria);

            window.scrollTo({ top: 150, behavior: "smooth" });
        });
    });
}

function addToCart(id) {
    const producto = menuData.find((p) => p.id === id);
    const itemEnCarrito = cart.find((item) => item.id === id);

    if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
    } else {
        cart.push({ ...producto, cantidad: 1 });
    }

    actualizarBarraFlotante();
}

function actualizarBarraFlotante() {
    const totalQty = cart.reduce((acc, item) => acc + item.cantidad, 0);
    const totalPrice = cart.reduce(
        (acc, item) => acc + item.cantidad * item.precio,
        0,
    );

    const footer = document.getElementById("footer-cart");
    if (footer) {
        footer.style.display = totalQty > 0 ? "flex" : "none";
        document.getElementById("cart-qty").innerText = Math.floor(totalQty);
        document.getElementById("cart-total").innerText = Math.floor(totalPrice);
    }
    animateCart();
}

function openOrderSummary() {
    const listContainer = document.getElementById("cart-items-list");
    const subtotalLabel = document.getElementById("subtotal-val");
    const totalLabel = document.getElementById("final-total-val");

    listContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
        const subtotalItem = item.cantidad * item.precio;
        total += subtotalItem;

        listContainer.innerHTML += `
            <tr>
                <td class="qty-cell">${item.cantidad}x</td>
                <td class="name-cell">${item.nom}</td>
                <td class="price-cell">Bs. ${Math.floor(subtotalItem)}</td>
                <td class="action-cell">
                    <button class="btn-delete" onclick="removeItem(${item.id})" title="Eliminar producto">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    subtotalLabel.innerText = Math.floor(total);
    totalLabel.innerText = Math.floor(total);
    document.getElementById("order-modal").style.display = "block";
}

function closeModal() {
    document.getElementById("order-modal").style.display = "none";
}

function removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    if (cart.length === 0) {
        closeModal();
    } else {
        openOrderSummary();
    }
    actualizarBarraFlotante();
}

function irAFormulario() {
    closeModal();
    document.getElementById("data-modal").style.display = "block";
}

function closeDataModal() {
    document.getElementById("data-modal").style.display = "none";
}

function toggleDelivery(isDelivery) {
    document.getElementById("delivery-section").style.display = isDelivery
        ? "block"
        : "none";
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById("direccion").value =
                `https://www.google.com/maps?q=${lat},${lon}`;
            alert("Ubicación obtenida.");
        });
    }
}

function confirmarPedido() {
    const nombre = document.getElementById("nombre-cliente").value;
    const telf = document.getElementById("telefono-cliente").value;
    const entrega = document.querySelector('input[name="entrega"]:checked').value;
    const direccion = document.getElementById("direccion").value;
    const pago = document.getElementById("metodo-pago").value;

    if (!nombre || !telf) {
        alert("Por favor, completa tus datos.");
        return;
    }

    let mensaje = `*NUEVO PEDIDO - PANADERIA DOÑA VIQUI*\n\n`;
    mensaje += `*Cliente:* ${nombre}\n`;
    mensaje += `*Celular:* ${telf}\n`;
    mensaje += `*Tipo:* ${entrega}\n`;

    if (entrega === "Delivery") {
        mensaje += `*Dirección:* ${direccion}\n`;
    }

    mensaje += `*Pago:* ${pago}\n\n`;
    mensaje += `*PRODUCTOS:*\n`;

    let total = 0;
    cart.forEach((item) => {
        const sub = item.cantidad * item.precio;
        mensaje += `- ${item.cantidad}x ${item.nom} (Bs. ${Math.floor(sub)})\n`;
        total += sub;
    });

    mensaje += `\n*TOTAL A PAGAR: Bs. ${Math.floor(total)}*`;

    const numeroWhatsApp = "59177532883";
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
}

function verificarHorario() {
    const statusElement = document.getElementById("store-status");
    if (!statusElement) return;

    const ahora = new Date();
    const horaActual = ahora.getHours();

    const horaApertura = 8;
    const horaCierre = 18;

    if (horaActual >= horaApertura && horaActual < horaCierre) {
        statusElement.textContent = "Abierto";
        statusElement.className = "status-open";
    } else {
        statusElement.textContent = "Cerrado";
        statusElement.className = "status-closed";
    }
}

function animateCart() {
    const badge = document.querySelector(".cart-badge");
    if (badge) {
        badge.style.transform = "scale(1.2)";
        setTimeout(() => {
            badge.style.transform = "scale(1)";
        }, 200);
    }
}

setInterval(verificarHorario, 60000);
