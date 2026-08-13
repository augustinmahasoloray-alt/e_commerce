import { ArrowRight } from "lucide-react";
import ProductCard from "../product/ProductCard";

const products = [
  {
    name: "Sac tote cuir pleine fleur",
    price: "1 200 €",
    label: "Nouveauté",
    stockStatus: "en-stock",
    freeShipping: true,
    image: "/images/products/sac-tote.jpg",
  },
  {
    name: "Ceinture artisanale tressée",
    price: "450 € TTC",
    label: "Best-seller",
    stockStatus: "en-stock",
    image: "/images/products/ceinture.jpg",
  },
  {
    name: "Veste en lin brut",
    price: "850 €",
    oldPrice: "1 500 €",
    discountPercent: 30,
    label: "Édition limitée",
    stockStatus: "en-stock",
    image: "/images/products/veste-lin.jpg",
  },
  {
    name: "Montre automatique acier",
    price: "1 200 €",
    label: "Tendance",
    stockStatus: "rupture",
    image: "/images/products/montre.jpg",
  },
  {
    name: "Écharpe cachemire",
    price: "450 € TTC",
    stockStatus: "bientot",
    image: "/images/products/echarpe.jpg",
  },
  {
    name: "Portefeuille cuir grainé",
    price: "850 €",
    label: "Best-seller",
    stockStatus: "en-stock",
    freeShipping: true,
    image: "/images/products/portefeuille.jpg",
  },
];

function Products() {
  return (
    <section className="w-full bg-backgroundColor py-24 sm:py-32 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
        <div>
          <h2 className="font-headline text-2xl sm:text-3xl text-textColor tracking-wide mb-3">
            La sélection
          </h2>
          <p className="font-body text-base text-muted">
            Des pièces choisies pour leur caractère et leur qualité.
          </p>
        </div>

        <a
          href="/produits"
          className="group inline-flex items-center gap-2 font-body text-sm text-textColor shrink-0"
        >
          Voir toute la sélection
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {products.map((p) => (
          <ProductCard key={p.name} product={p} />
        ))}
      </div>
    </section>
  );
}

export default Products;