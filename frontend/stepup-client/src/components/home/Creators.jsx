import { ArrowRight } from "lucide-react";

const sampleCreators = [
  { name: "Atelier Sundara", category: "Mobilier", image: "/images/creators/atelier-sundara.jpg", to: "/vendeur/atelier-sundara" },
  { name: "Maison Verlaine", category: "Mode", image: "/images/creators/maison-verlaine.jpg", to: "/vendeur/maison-verlaine" },
  { name: "Noir & Cuir", category: "Accessoires", image: "/images/creators/noir-et-cuir.jpg", to: "/vendeur/noir-et-cuir" },
  { name: "Studio Argile", category: "Arts de la table", image: "/images/creators/studio-argile.jpg", to: "/vendeur/studio-argile" },
];

function Creators({ creators = sampleCreators }) {
  return (
    <section className="w-full bg-backgroundColor py-24 sm:py-32 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-16">
        <div className="max-w-xl">
          <p className="font-body text-sm tracking-[0.2em] uppercase text-accent mb-4">
            Univers
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-textColor leading-[1.1] mb-6">
            Les créateurs
          </h2>
          <p className="font-body text-base text-muted leading-relaxed">
            Derrière chaque produit, un homme ou une femme qui a fait le choix de l'exigence.
            Des marques émergentes aux talents confirmés, ils partagent tous une même obsession :
            la qualité.
          </p>
        </div>

        <a
          href="/createurs"
          className="group inline-flex items-center gap-2 font-body text-sm text-textColor shrink-0"
        >
          Découvrir les créateurs
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {creators.map((c) => (
          <a key={c.to} href={c.to} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden mb-4">
              <img
                src={c.image}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <h3 className="font-headline text-base text-textColor mb-1">{c.name}</h3>
            <p className="font-body text-sm text-muted mb-2">{c.category}</p>
            <span className="font-body text-xs text-accent group-hover:underline">
              Voir la boutique
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default Creators;