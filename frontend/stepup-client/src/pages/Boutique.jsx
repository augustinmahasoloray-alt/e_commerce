import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal, Star, Heart, Scale, Grid3x3, List,
  ChevronDown, X, Zap, Flame, AlertTriangle,
} from "lucide-react";

/**
 * StepUp — Boutique (catalogue unique, mono-vendeur)
 * Regroupe deux univers : Chaussures et Électronique.
 * Filtrable via query params : ?univers=chaussures|electronique&categorie=...&marque=...
 * pt-20 NON inclus ici : App.jsx l'ajoute déjà pour toute route ≠ "/".
 */

const univers = [
  {
    key: "chaussures",
    label: "Chaussures",
    categories: ["Sneakers", "Running", "Talons", "Bottes", "Sandales", "Mocassins", "Enfants", "Accessoires"],
    brands: ["Nike", "Adidas", "Puma", "Clarks", "Timberland", "Birkenstock"],
  },
  {
    key: "electronique",
    label: "Électronique",
    categories: ["PC Gaming", "Consoles", "Écrans", "Casques", "Claviers", "Smartphones"],
    brands: ["Asus", "MSI", "Sony", "Microsoft", "Samsung", "Razer", "Logitech", "Apple"],
  },
];

const conditions = ["Neuf", "Reconditionné", "Occasion"];

const badgeStyles = {
  promo: { label: "Promo", icon: null, className: "bg-red-500/90 text-white" },
  express: { label: "Livraison Express", icon: Zap, className: "bg-textColor text-backgroundColor" },
  topvente: { label: "Top vente", icon: Flame, className: "bg-textColor text-backgroundColor" },
  dernierepiece: { label: "Dernière pièce", icon: AlertTriangle, className: "bg-muted text-backgroundColor" },
};

const products = [
  // Chaussures
  { name: "Sneaker Cuir Blanc", univers: "chaussures", cat: "Sneakers", brand: "Nike", price: 89.99, oldPrice: 109.99, rating: 4.8, reviews: 120, stock: "En stock", badges: ["promo", "topvente"], img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80" },
  { name: "Running Air Léger", univers: "chaussures", cat: "Running", brand: "Adidas", price: 104.99, oldPrice: null, rating: 4.7, reviews: 98, stock: "En stock", badges: ["express"], img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
  { name: "Derby Cuir Marron", univers: "chaussures", cat: "Mocassins", brand: "Clarks", price: 129.99, oldPrice: null, rating: 4.9, reviews: 156, stock: "Plus que 3 unités", badges: ["topvente"], img: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600&q=80" },
  { name: "Sandale Minimaliste", univers: "chaussures", cat: "Sandales", brand: "Birkenstock", price: 59.99, oldPrice: null, rating: 4.6, reviews: 69, stock: "En stock", badges: [], img: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80" },
  { name: "Botte Chelsea Noire", univers: "chaussures", cat: "Bottes", brand: "Timberland", price: 149.99, oldPrice: 179.99, rating: 4.8, reviews: 132, stock: "En stock", badges: ["promo"], img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80" },
  { name: "Sneaker Édition Studio", univers: "chaussures", cat: "Sneakers", brand: "Puma", price: 119.99, oldPrice: null, rating: 4.9, reviews: 110, stock: "Rupture", badges: [], img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80" },
  // Électronique
  { name: "PC Gaming Asus ROG Strix", univers: "electronique", cat: "PC Gaming", brand: "Asus", price: 1899, oldPrice: 2199, rating: 4.7, reviews: 234, stock: "En stock", badges: ["promo"], img: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80" },
  { name: "Écran MSI 27\" 240Hz QHD", univers: "electronique", cat: "Écrans", brand: "MSI", price: 349, oldPrice: null, rating: 4.6, reviews: 98, stock: "Plus que 3 unités", badges: ["express"], img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80" },
  { name: "Casque Sony WH-1000XM5", univers: "electronique", cat: "Casques", brand: "Sony", price: 329, oldPrice: 379, rating: 4.9, reviews: 512, stock: "En stock", badges: ["promo", "topvente"], img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80" },
  { name: "Console PlayStation 5", univers: "electronique", cat: "Consoles", brand: "Sony", price: 549, oldPrice: null, rating: 4.8, reviews: 876, stock: "En stock", badges: ["topvente"], img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80" },
  { name: "Clavier Razer BlackWidow V4", univers: "electronique", cat: "Claviers", brand: "Razer", price: 159, oldPrice: null, rating: 4.5, reviews: 143, stock: "Plus que 3 unités", badges: ["express"], img: "https://images.unsplash.com/photo-1595225476474-63038da0b6f5?w=600&q=80" },
  { name: "Smartphone Samsung Galaxy S25", univers: "electronique", cat: "Smartphones", brand: "Samsung", price: 899, oldPrice: 999, rating: 4.7, reviews: 601, stock: "En stock", badges: ["promo"], img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80" },
];

const sortOptions = ["Pertinence", "Prix croissant", "Prix décroissant", "Notes des acheteurs"];

function Pill({ children, variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300";
  const variants = {
    primary: "bg-accent text-backgroundColor hover:opacity-90",
    secondary: "border border-muted/40 text-textColor hover:border-accent hover:text-accent",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
}

function Badge({ type }) {
  const cfg = badgeStyles[type];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${cfg.className}`}>
      {Icon && <Icon size={10} />}
      {cfg.label}
    </span>
  );
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-muted/10 py-5">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between text-sm font-medium mb-3">
        {title}
        <ChevronDown size={14} className={`transition-transform duration-300 text-muted ${open ? "rotate-180" : ""}`} />
      </button>
      {open && children}
    </div>
  );
}

export default function Boutique() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeUnivers = searchParams.get("univers") || "chaussures";
  const activeCat = searchParams.get("categorie") || "Tout";

  const [sort, setSort] = useState(sortOptions[0]);
  const [view, setView] = useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [freeDeliveryOnly, setFreeDeliveryOnly] = useState(false);
  const [priceMax, setPriceMax] = useState(2500);

  const currentUnivers = univers.find((u) => u.key === activeUnivers) ?? univers[0];

  const setUnivers = (key) => {
    setSearchParams({ univers: key });
    setSelectedBrands([]);
  };

  const setCategorie = (cat) => {
    const params = { univers: activeUnivers };
    if (cat !== "Tout") params.categorie = cat;
    setSearchParams(params);
  };

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (p.univers !== activeUnivers) return false;
      if (activeCat !== "Tout" && p.cat !== activeCat) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (p.price > priceMax) return false;
      return true;
    });
  }, [activeUnivers, activeCat, selectedBrands, priceMax]);

  const FiltersPanel = () => (
    <>
      <FilterSection title="Prix">
        <input
          type="range"
          min={0}
          max={2500}
          step={10}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-[var(--color-accent,#e09f3e)]"
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>0 €</span>
          <span>{priceMax} €</span>
        </div>
      </FilterSection>

      <FilterSection title="Marques">
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
          {currentUnivers.brands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => toggle(selectedBrands, setSelectedBrands, b)}
                className="accent-[var(--color-accent,#e09f3e)]"
              />
              {b}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="État">
        <div className="flex flex-col gap-2">
          {conditions.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={selectedConditions.includes(c)}
                onChange={() => toggle(selectedConditions, setSelectedConditions, c)}
                className="accent-[var(--color-accent,#e09f3e)]"
              />
              {c}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Livraison" defaultOpen={false}>
        <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
          <input type="checkbox" checked={freeDeliveryOnly} onChange={() => setFreeDeliveryOnly((v) => !v)} className="accent-[var(--color-accent,#e09f3e)]" />
          Livraison gratuite
        </label>
      </FilterSection>
    </>
  );

  return (
    <main className="min-h-screen font-body bg-backgroundColor text-textColor">
      {/* en-tête boutique */}
      <section className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40 py-10 border-b border-muted/10">
        <span className="text-xs tracking-[0.2em] text-accent font-medium">— LA BOUTIQUE STEPUP</span>
        <h1 className="font-display font-light text-4xl md:text-5xl leading-tight mt-3">
          Chaussures & électronique, sélectionnées pour vous.
        </h1>

        {/* toggle univers */}
        <div className="flex gap-3 mt-6">
          {univers.map((u) => (
            <button
              key={u.key}
              onClick={() => setUnivers(u.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeUnivers === u.key ? "bg-accent text-backgroundColor" : "bg-surfaceColor text-muted hover:text-accent"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </section>

      <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40 py-8 grid lg:grid-cols-[260px_1fr] gap-10">
        <aside className="hidden lg:block">
          <div className="flex items-center gap-2 mb-2">
            <SlidersHorizontal size={16} className="text-accent" />
            <h2 className="font-headline text-lg">Filtres</h2>
          </div>
          <FiltersPanel />
        </aside>

        <div>
          {/* catégories du univers actif */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setCategorie("Tout")}
              className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 ${
                activeCat === "Tout" ? "bg-accent text-backgroundColor" : "bg-surfaceColor text-muted hover:text-accent"
              }`}
            >
              Tout
            </button>
            {currentUnivers.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategorie(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 ${
                  activeCat === cat ? "bg-accent text-backgroundColor" : "bg-surfaceColor text-muted hover:text-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-muted/30 text-muted"
              >
                <SlidersHorizontal size={14} /> Filtres
              </button>
              <span className="text-sm text-muted">{filtered.length} produits</span>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-surfaceColor text-sm rounded-full px-4 py-2 outline-none"
              >
                {sortOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
              <div className="hidden sm:flex items-center gap-1 bg-surfaceColor rounded-full p-1">
                <button onClick={() => setView("grid")} className={`p-1.5 rounded-full ${view === "grid" ? "bg-accent text-backgroundColor" : "text-muted"}`} aria-label="Vue grille">
                  <Grid3x3 size={14} />
                </button>
                <button onClick={() => setView("list")} className={`p-1.5 rounded-full ${view === "list" ? "bg-accent text-backgroundColor" : "text-muted"}`} aria-label="Vue liste">
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {filtered.map((p) => (
              <div key={p.name} className={view === "grid" ? "group cursor-pointer" : "group cursor-pointer flex gap-4 bg-surfaceColor rounded-xl p-3"}>
                <div className={view === "grid" ? "relative aspect-square rounded-xl overflow-hidden bg-surfaceColor mb-3" : "relative w-32 h-32 shrink-0 rounded-lg overflow-hidden bg-backgroundColor"}>
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    {p.badges.map((b) => <Badge key={b} type={b} />)}
                  </div>
                  <button aria-label="Favoris" className="absolute top-2 right-2 w-7 h-7 rounded-full bg-backgroundColor/80 flex items-center justify-center">
                    <Heart size={13} />
                  </button>
                </div>

                <div className="flex-1">
                  <p className="text-[11px] text-accent uppercase tracking-wide mb-0.5">{p.brand}</p>
                  <p className="text-sm font-medium leading-tight">{p.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={10} fill="currentColor" className="text-accent" />
                    ))}
                    <span className="text-[11px] text-muted ml-1">{p.rating} · {p.reviews} avis</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-headline text-base">{p.price.toFixed(2)} €</span>
                    {p.oldPrice && <span className="text-xs text-muted line-through">{p.oldPrice.toFixed(2)} €</span>}
                  </div>

                  <p className={`text-[11px] mt-1 ${
                    p.stock === "En stock" ? "text-accent" : p.stock === "Rupture" ? "text-muted" : "text-orange-500"
                  }`}>
                    {p.stock}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <Pill variant="primary" className="!px-4 !py-2 text-xs flex-1" disabled={p.stock === "Rupture"}>
                      {p.stock === "Rupture" ? "Précommander" : "Ajouter au panier"}
                    </Pill>
                    <button aria-label="Comparer" className="w-9 h-9 rounded-full border border-muted/30 flex items-center justify-center hover:border-accent hover:text-accent transition-colors shrink-0">
                      <Scale size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-sm text-muted text-center py-16">Aucun produit ne correspond à ces filtres.</p>
          )}
        </div>
      </div>

      {/* tiroir filtres mobile */}
      <div className={`fixed inset-0 z-[110] lg:hidden transition-opacity duration-300 ${mobileFiltersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-textColor/40" onClick={() => setMobileFiltersOpen(false)} />
        <div className={`absolute top-0 left-0 h-full w-full max-w-xs bg-backgroundColor shadow-xl transition-transform duration-300 overflow-y-auto ${mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-5 py-5 border-b border-muted/10">
            <h3 className="font-headline text-lg">Filtres</h3>
            <button onClick={() => setMobileFiltersOpen(false)} aria-label="Fermer"><X size={20} /></button>
          </div>
          <div className="px-5"><FiltersPanel /></div>
          <div className="px-5 py-5">
            <Pill variant="primary" className="w-full" onClick={() => setMobileFiltersOpen(false)}>
              Voir les résultats
            </Pill>
          </div>
        </div>
      </div>
    </main>
  );
}