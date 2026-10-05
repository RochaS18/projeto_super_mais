(function () {
  const ADMIN_SESSION_KEY = "supermais_admin_session";
  const CATALOG_KEY = "supermais_admin_catalog";
  const DELETED_KEY = "supermais_deleted_products";

  const defaultCatalog = [
    { id: 1, name: "Furadeira Elétrica", category: "Ferramentas", section: "Ferramentas", price: "199,90", image: "imagens/furadeira.jpg" },
    { id: 2, name: "Parafusadeira", category: "Ferramentas", section: "Ferramentas", price: "249,90", image: "imagens/parafusadeira.jpg" },
    { id: 3, name: "Kit de Chaves", category: "Ferramentas", section: "Ferramentas", price: "89,90", image: "imagens/kit-chaves.jpg" },
    { id: 4, name: "Arroz Branco Camil Tipo 1", category: "Alimentos", section: "Alimentos", price: "22,90", image: "../alimentos/imagens/" },
    { id: 5, name: "Feijão Carioca", category: "Alimentos", section: "Alimentos", price: "7,49", image: "../alimentos/imagens/" },
    { id: 6, name: "Sabonete em Barra", category: "Higiene", section: "Higiene", price: "4,99", image: "../higiene/imagem/" },
    { id: 7, name: "Papel Higiênico", category: "Higiene", section: "Higiene", price: "18,90", image: "../higiene/imagem/" },
    { id: 8, name: "Brigadeiro Gourmet", category: "Doces", section: "Doces", price: "12,50", image: "../pagina_doce/imgdoces/" },
    { id: 9, name: "Bolo de Chocolate", category: "Doces", section: "Doces", price: "19,90", image: "../pagina_doce/imgdoces/" }
  ];

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function ensureAdminSession() {
    if (localStorage.getItem(ADMIN_SESSION_KEY) !== "true") {
      window.location.href = "../pagina_inicial.html";
    }
  }

  function loadCatalog() {
    const saved = readStorage(CATALOG_KEY, defaultCatalog);
    return Array.isArray(saved) && saved.length ? saved : defaultCatalog;
  }

  function saveCatalog(list) {
    writeStorage(CATALOG_KEY, list);
  }

  function loadDeleted() {
    const deleted = readStorage(DELETED_KEY, []);
    return Array.isArray(deleted) ? deleted : [];
  }

  function saveDeleted(list) {
    writeStorage(DELETED_KEY, list);
  }

  function getProductList() {
    return loadCatalog();
  }

  function renderStats() {
    const catalog = getProductList();
    const deleted = loadDeleted();
    const active = catalog.filter((product) => !deleted.includes(normalize(product.name))).length;

    document.getElementById("total-produtos").textContent = String(catalog.length);
    document.getElementById("produtos-ativos").textContent = String(active);
    document.getElementById("produtos-removidos").textContent = String(deleted.length);
  }

  function renderProducts() {
    const catalog = getProductList();
    const deleted = loadDeleted();
    const query = normalize(document.getElementById("product-search").value || "");
    const filtered = catalog.filter((product) => {
      const match = !query || normalize(product.name).includes(query) || normalize(product.category).includes(query) || normalize(product.section).includes(query);
      return match;
    });

    const list = document.getElementById("product-list");

    if (!filtered.length) {
      list.innerHTML = '<div class="empty-state">Nenhum produto encontrado.</div>';
      renderStats();
      return;
    }

    list.innerHTML = filtered.map((product) => {
      const isRemoved = deleted.includes(normalize(product.name));
      return `
        <article class="product-item ${isRemoved ? "removed" : ""}">
          <div>
            <span class="badge">${product.category}</span>
            <h3>${product.name}</h3>
            <p>${product.section}</p>
          </div>

          <div class="product-price">R$ ${product.price}</div>

          <div class="product-actions">
            <button type="button" class="edit-btn" data-action="edit" data-id="${product.id}">Editar</button>
            <button type="button" class="${isRemoved ? "restore-btn" : "delete-btn"}" data-action="${isRemoved ? "restore" : "delete"}" data-id="${product.id}">${isRemoved ? "Restaurar" : "Excluir"}</button>
          </div>
        </article>
      `;
    }).join("");

    renderStats();
  }

  function clearForm() {
    document.getElementById("product-id").value = "";
    document.getElementById("product-name").value = "";
    document.getElementById("product-category").value = "";
    document.getElementById("product-section").value = "Ferramentas";
    document.getElementById("product-price").value = "";
    document.getElementById("product-image").value = "";
  }

  function fillForm(product) {
    document.getElementById("product-id").value = product.id;
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-category").value = product.category;
    document.getElementById("product-section").value = product.section;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-image").value = product.image || "";
  }

  function handleAddOrUpdate(event) {
    event.preventDefault();

    const id = document.getElementById("product-id").value;
    const catalog = getProductList();
    const payload = {
      id: id ? Number(id) : Date.now(),
      name: document.getElementById("product-name").value.trim(),
      category: document.getElementById("product-category").value.trim(),
      section: document.getElementById("product-section").value,
      price: document.getElementById("product-price").value.trim(),
      image: document.getElementById("product-image").value.trim() || ""
    };

    if (!payload.name || !payload.category || !payload.price) {
      alert("Preencha nome, categoria e preço do produto.");
      return;
    }

    if (id) {
      const index = catalog.findIndex((product) => product.id === Number(id));
      if (index >= 0) {
        catalog[index] = payload;
      }
    } else {
      catalog.push(payload);
    }

    saveCatalog(catalog);
    clearForm();
    renderProducts();
  }

  function deleteProduct(id) {
    const catalog = getProductList();
    const product = catalog.find((item) => item.id === Number(id));
    if (!product) return;

    const deleted = loadDeleted();
    const key = normalize(product.name);
    if (!deleted.includes(key)) {
      deleted.push(key);
      saveDeleted(deleted);
    }

    renderProducts();
  }

  function restoreProduct(id) {
    const catalog = getProductList();
    const product = catalog.find((item) => item.id === Number(id));
    if (!product) return;

    const deleted = loadDeleted().filter((name) => name !== normalize(product.name));
    saveDeleted(deleted);
    renderProducts();
  }

  function handleProductActions(event) {
    const element = event.target.closest("button[data-action]");
    if (!element) return;

    const action = element.dataset.action;
    const id = Number(element.dataset.id);

    if (action === "edit") {
      const product = getProductList().find((item) => item.id === id);
      if (product) {
        fillForm(product);
      }
      return;
    }

    if (action === "delete") {
      deleteProduct(id);
      return;
    }

    if (action === "restore") {
      restoreProduct(id);
    }
  }

  function bindEvents() {
    document.getElementById("product-form").addEventListener("submit", handleAddOrUpdate);
    document.getElementById("product-search").addEventListener("input", renderProducts);
    document.getElementById("cancel-edit").addEventListener("click", clearForm);
    document.getElementById("logout-admin").addEventListener("click", () => {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      window.location.href = "../pagina_inicial.html";
    });
    document.getElementById("product-list").addEventListener("click", handleProductActions);
  }

  ensureAdminSession();
  bindEvents();
  renderProducts();
})();
