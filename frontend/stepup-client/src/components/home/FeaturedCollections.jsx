import { ArrowRight } from "lucide-react";

const collections = [
  { label: "Nouveauté", title: "Édition Automne", image: "/images/collections/automne.jpg", to: "/collections/automne" },
  { label: "Édition limitée", title: "Capsule Artisans", image: "/images/collections/capsule-artisans.jpg", to: "/collections/capsule-artisans" },
  { label: "Tendance", title: "Essentiels du moment", image: "/images/collections/essentiels.jpg", to: "/collections/essentiels" },
  { label: "Sélection exigeante", title: "Le meilleur du savoir-faire", image: "/images/collections/savoir-faire.jpg", to: "/collections/savoir-faire" },
  { label: "Coup de cœur", title: "Nos préférées", image: "/images/collections/preferees.jpg", to: "/collections/preferees" },
  { label: "Best-seller", title: "Les incontournables", image: "/images/collections/incontournables.jpg", to: "/collections/incontournables" },
];

function CollectionCard({ c }) {
  return (
    <a
      href={c.to}
      className="group relative shrink-0 w-[280px] sm:w-[340px] aspect-[3/4] overflow-hidden"
    >
      <img
        src={c.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />

      <span className="absolute top-5 left-5 font-body text-xs tracking-[0.1em] uppercase text-[#0B0B0B] bg-accent px-3 py-1.5">
        {c.label}
      </span>

      <div className="relative z-10 h-full flex items-end p-6">
        <h3 className="font-headline text-xl text-[#F5F5F5]">{c.title}</h3>
      </div>
    </a>
  );
}

function FeaturedCollections() {
  return (
    <section className="w-full bg-backgroundColor py-24 sm:py-32">
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
        <div>
          <p className="font-body text-sm tracking-[0.2em] uppercase text-accent mb-4">
            Nos coups de cœur
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-textColor leading-[1.1]">
            Collections du moment
          </h2>
          <p className="font-body text-base text-muted mt-4">
            Des sélections thématiques. Sans concession.
          </p>
        </div>

        <a
          href="/collections"
          className="group inline-flex items-center gap-2 font-body text-sm text-textColor shrink-0"
        >
          Voir toutes les collections
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>

      {/* Piste de défilement infini : le contenu est dupliqué une fois,
          l'animation translate de 0 à -50% en boucle exacte */}
      <div className="relative overflow-hidden">
        <div className="marquee-track flex gap-5 w-max">
          {[...collections, ...collections].map((c, i) => (
            <CollectionCard key={`${c.to}-${i}`} c={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollections;