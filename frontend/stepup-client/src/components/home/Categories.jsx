import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "Mobilier & Architecture",
    description: "Du minimalisme radical au design industriel.",
    image: "/images/categories/mobilier.jpg",
    to: "/categorie/mobilier",
    featured: true,
  },
  {
    title: "Mode & Accessoires",
    description: "Des pièces fortes pour une garde-robe qui ne laisse pas indifférent.",
    image: "/images/categories/mode.jpg",
    to: "/categorie/mode",
  },
  {
    title: "Soin & Rituels",
    description: "L'exigence du détail. Pour le corps et l'esprit.",
    image: "/images/categories/soin.jpg",
    to: "/categorie/soin",
  },
  {
    title: "Arts de la table",
    description: "Recevoir avec style. Dans le moindre détail.",
    image: "/images/categories/arts-de-la-table.jpg",
    to: "/categorie/arts-de-la-table",
  },
  {
    title: "Cadeaux",
    description: "Des objets qui marquent les esprits. Pour ceux qui comptent.",
    image: "/images/categories/cadeaux.jpg",
    to: "/categorie/cadeaux",
  },
  {
    title: "Beaux-Arts & Édition",
    description: "Des œuvres et des livres pour habiller vos murs et vos esprits.",
    image: "/images/categories/beaux-arts.jpg",
    to: "/categorie/beaux-arts",
  },
];

function CategoryCard({ category, className = "" }) {
  return (
    <a
      href={category.to}
      className={`group relative block overflow-hidden ${className}`}
    >
      <img
        src={category.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
        <h3 className="font-headline text-xl sm:text-2xl text-[#F5F5F5] mb-2">
          {category.title}
        </h3>
        <p className="font-body text-sm text-[#E5E5E5] leading-relaxed mb-4 max-w-xs">
          {category.description}
        </p>
        <span className="inline-flex items-center gap-2 font-body text-sm text-accent">
          Explorer
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>
    </a>
  );
}

function Categories() {
  const [featured, ...rest] = categories;

  return (
    <section className="w-full bg-backgroundColor py-24 sm:py-32 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40">
      <h2 className="font-headline text-2xl sm:text-3xl text-textColor tracking-wide mb-12 sm:mb-16">
        Par univers
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <CategoryCard
          category={featured}
          className="lg:col-span-2 lg:row-span-2 aspect-[4/3] lg:aspect-auto"
        />

        {rest.map((cat) => (
          <CategoryCard key={cat.to} category={cat} className="aspect-[4/3]" />
        ))}
      </div>
    </section>
  );
}

export default Categories;