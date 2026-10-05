(function () {
  "use strict";

  const ADMIN_DELETED_KEY = "supermais_deleted_products";

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function readDeleted() {
    try {
      const raw = localStorage.getItem(ADMIN_DELETED_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map((item) => normalize(item)) : [];
    } catch (error) {
      return [];
    }
  }

  function getProductName(element) {
    if (!element) return "";

    const datasetName = element.getAttribute("data-product") || element.getAttribute("data-name") || element.getAttribute("data-product-name");
    if (datasetName) return datasetName.trim();

    const selectors = [
      "h3",
      "h2",
      ".product-name",
      ".nome-produto",
      ".product-title",
      ".card-title",
      ".produto-nome"
    ];

    for (const selector of selectors) {
      const node = element.querySelector(selector);
      if (node && node.textContent) return node.textContent.trim();
    }

    const textContent = element.textContent || "";
    return textContent.replace(/\s+/g, " ").trim();
  }

  function hideMatchingProducts() {
    const deleted = readDeleted();
    if (!deleted.length) return;

    const candidates = document.querySelectorAll(
      "article, .produto, .product-card, .item-produto, .card-produto, li"
    );

    candidates.forEach((element) => {
      const name = getProductName(element);
      if (!name) return;

      if (deleted.includes(normalize(name))) {
        element.hidden = true;
        element.setAttribute("aria-hidden", "true");
        element.style.display = "none";
      }
    });
  }

  hideMatchingProducts();
})();
