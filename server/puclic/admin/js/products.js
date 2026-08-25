// js/products.js

let variantCount = 0;

// ============ Ouverture / fermeture du modal ============

function openProductModal() {
    document.getElementById("productModal").classList.remove("hidden");
    loadCategoriesAndBrands();
    if (document.getElementById("variantsList").children.length === 0) {
        addVariantRow();
    }
}

function closeProductModal() {
    document.getElementById("productModal").classList.add("hidden");
    document.getElementById("productForm").reset();
    document.getElementById("variantsList").innerHTML = "";
    document.getElementById("imagePreviews").innerHTML = "";
    document.getElementById("productFormError").classList.add("hidden");
    variantCount = 0;
}

document.getElementById("openAddProduct").addEventListener("click", openProductModal);
document.getElementById("closeModalBtn").addEventListener("click", closeProductModal);
document.getElementById("cancelProductBtn").addEventListener("click", closeProductModal);
document.getElementById("modalBackdrop").addEventListener("click", closeProductModal);

// ============ Catégories & marques (peuplent les <select>) ============

async function loadCategoriesAndBrands() {
    const categorySelect = document.getElementById("p_category");
    const brandSelect = document.getElementById("p_brand");

    try {
        const response = await apiFetch("/api/admin/products/meta/categories-brands");
        if (!response) return;
        const result = await response.json();

        categorySelect.innerHTML = '<option value="">Sélectionner...</option>';
        result.categories.forEach((cat) => {
            // On ne propose que les catégories "feuilles" (avec parent) ou sans enfants,
            // pour éviter de rattacher un produit directement à un "univers" racine.
            if (cat.children.length === 0) {
                const opt = document.createElement("option");
                opt.value = cat.id;
                opt.textContent = cat.nom;
                categorySelect.appendChild(opt);
            } else {
                cat.children.forEach((child) => {
                    const opt = document.createElement("option");
                    opt.value = child.id;
                    opt.textContent = `${cat.nom} — ${child.nom}`;
                    categorySelect.appendChild(opt);
                });
            }
        });

        brandSelect.innerHTML = '<option value="">Sélectionner...</option>';
        result.brands.forEach((brand) => {
            const opt = document.createElement("option");
            opt.value = brand.id;
            opt.textContent = brand.nom;
            brandSelect.appendChild(opt);
        });
    } catch (err) {
        console.error("Erreur chargement catégories/marques :", err);
    }
}

// ============ Variantes dynamiques ============

function addVariantRow() {
    variantCount++;
    const id = variantCount;

    const row = document.createElement("div");
    row.className = "grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center";
    row.dataset.variantId = id;
    row.innerHTML = `
        <input type="text" placeholder="Taille" data-field="taille" required
            class="px-3 py-2 rounded-md bg-backgroundColor border border-muted/30 outline-none text-sm focus:ring-2 focus:ring-accent" />
        <input type="text" placeholder="Couleur" data-field="couleur" required
            class="px-3 py-2 rounded-md bg-backgroundColor border border-muted/30 outline-none text-sm focus:ring-2 focus:ring-accent" />
        <input type="number" placeholder="Stock" data-field="stock" min="0" required
            class="px-3 py-2 rounded-md bg-backgroundColor border border-muted/30 outline-none text-sm focus:ring-2 focus:ring-accent" />
        <input type="text" placeholder="SKU" data-field="sku" required
            class="px-3 py-2 rounded-md bg-backgroundColor border border-muted/30 outline-none text-sm focus:ring-2 focus:ring-accent" />
        <button type="button" class="removeVariantBtn text-red-500 hover:text-red-600 text-sm px-2" aria-label="Supprimer la variante">✕</button>
    `;

    row.querySelector(".removeVariantBtn").addEventListener("click", () => row.remove());
    document.getElementById("variantsList").appendChild(row);
}

document.getElementById("addVariantBtn").addEventListener("click", addVariantRow);

function collectVariants() {
    const rows = document.querySelectorAll("#variantsList > div");
    return Array.from(rows).map((row) => ({
        taille: row.querySelector('[data-field="taille"]').value,
        couleur: row.querySelector('[data-field="couleur"]').value,
        stock: row.querySelector('[data-field="stock"]').value,
        sku: row.querySelector('[data-field="sku"]').value,
    }));
}

// ============ Prévisualisation des images ============

document.getElementById("p_images").addEventListener("change", (e) => {
    const preview = document.getElementById("imagePreviews");
    preview.innerHTML = "";

    Array.from(e.target.files)
        .slice(0, 6)
        .forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = document.createElement("img");
                img.src = reader.result;
                img.className = "w-16 h-16 object-cover rounded-md";
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
});

// ============ Soumission du formulaire ============

document.getElementById("productForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const errorMsg = document.getElementById("productFormError");
    const submitBtn = document.getElementById("submitProductBtn");
    errorMsg.classList.add("hidden");

    const variants = collectVariants();
    if (variants.length === 0) {
        errorMsg.textContent = "Ajoute au moins une variante.";
        errorMsg.classList.remove("hidden");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Création en cours...";

    try {
        const formData = new FormData();
        formData.append("nom", document.getElementById("p_nom").value);
        formData.append("description", document.getElementById("p_description").value);
        formData.append("category_id", document.getElementById("p_category").value);
        formData.append("brand_id", document.getElementById("p_brand").value);
        formData.append("prix", document.getElementById("p_prix").value);

        const prixPromo = document.getElementById("p_prix_promo").value;
        if (prixPromo) formData.append("prix_promo", prixPromo);

        formData.append("variants", JSON.stringify(variants));

        const imageFiles = document.getElementById("p_images").files;
        Array.from(imageFiles).forEach((file) => formData.append("images", file));

        const response = await apiFetch("/api/admin/products", {
            method: "POST",
            body: formData,
        });
        if (!response) return;

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Erreur lors de la création du produit.");
        }

        closeProductModal();
        loadProducts();
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.classList.remove("hidden");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Créer le produit";
    }
});

// ============ Chargement & rendu du tableau produits ============

async function loadProducts() {
    const tbody = document.getElementById("productsTableBody");
    tbody.innerHTML = `<tr><td colspan="6" class="px-5 py-8 text-center text-muted">Chargement...</td></tr>`;

    try {
        const response = await apiFetch("/api/admin/products");
        if (!response) return;
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Erreur lors du chargement des produits.");
        }

        if (result.products.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="px-5 py-8 text-center text-muted">Aucun produit pour l'instant.</td></tr>`;
            return;
        }

        tbody.innerHTML = result.products
            .map((p) => {
                const stockColor =
                    p.statut_stock === "Rupture" ? "text-muted" : p.statut_stock === "En stock" ? "text-accent" : "text-orange-500";

                return `
                    <tr class="border-b border-muted/10 last:border-0">
                        <td class="px-5 py-3">${escapeHtml(p.nom)}</td>
                        <td class="px-5 py-3 text-muted">${escapeHtml(p.categorie ?? "—")}</td>
                        <td class="px-5 py-3">${Number(p.prix).toFixed(2)} €</td>
                        <td class="px-5 py-3">${p.stock_total}</td>
                        <td class="px-5 py-3 ${stockColor}">${p.statut_stock}</td>
                        <td class="px-5 py-3 text-right">
                            <button data-id="${p.id}" class="deleteProductBtn text-red-500 hover:underline text-xs">Supprimer</button>
                        </td>
                    </tr>
                `;
            })
            .join("");

        document.querySelectorAll(".deleteProductBtn").forEach((btn) => {
            btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
        });
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" class="px-5 py-8 text-center text-red-500">${escapeHtml(err.message)}</td></tr>`;
    }
}

async function deleteProduct(id) {
    if (!confirm("Supprimer ce produit définitivement ?")) return;

    try {
        const response = await apiFetch(`/api/admin/products/${id}`, { method: "DELETE" });
        if (!response) return;
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || "Erreur lors de la suppression.");
        }
        loadProducts();
    } catch (err) {
        alert(err.message);
    }
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str ?? "";
    return div.innerHTML;
}

// Charge le tableau au premier affichage de la section Produits
document.querySelector('[data-section="products"]').addEventListener("click", loadProducts);