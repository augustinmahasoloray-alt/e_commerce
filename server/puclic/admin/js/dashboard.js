// js/dashboard.js

let categoryChartInstance = null;

async function loadDashboardStats() {
    try {
        const response = await apiFetch("/api/admin/dashboard/stats");
        if (!response) return;
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Erreur lors du chargement des statistiques.");
        }

        const { produits_actifs, commandes_en_attente, chiffre_affaires, produits_par_categorie } = result.stats;

        document.getElementById("statProducts").textContent = produits_actifs;
        document.getElementById("statOrders").textContent = commandes_en_attente;
        document.getElementById("statRevenue").textContent = `${Number(chiffre_affaires).toFixed(2)} €`;

        renderCategoryChart(produits_par_categorie);
    } catch (err) {
        console.error("Erreur chargement stats :", err);
    }
}

function renderCategoryChart(data) {
    const ctx = document.getElementById("categoryChart");
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--color-accent").trim();
    const textColor = styles.getPropertyValue("--color-text").trim();

    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    categoryChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: data.map((d) => d.nom),
            datasets: [
                {
                    label: "Produits",
                    data: data.map((d) => d.count),
                    backgroundColor: accent,
                    borderRadius: 6,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
            },
            scales: {
                x: {
                    ticks: { color: textColor },
                    grid: { display: false },
                },
                y: {
                    ticks: { color: textColor, stepSize: 1 },
                    grid: { color: `${textColor}1a` },
                },
            },
        },
    });
}

loadDashboardStats();