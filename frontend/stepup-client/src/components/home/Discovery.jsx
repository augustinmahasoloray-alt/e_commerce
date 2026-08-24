import { ArrowRight } from "lucide-react";

function Discovery() {
  return (
    <section className="w-full bg-backgroundColor py-24 sm:py-32 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-5 lg:col-start-1">
          <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <img
              src="/images/discovery-marketplace.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
            <div
              aria-hidden="true"
              className="hidden lg:block absolute -bottom-6 -right-6 w-2/3 h-2/3 border border-accent/40 -z-10"
            />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 max-w-xl">
          <p className="font-body text-sm tracking-[0.2em] uppercase text-accent mb-5">
            Notre concept
          </p>

          <h2 className="font-display text-4xl sm:text-5xl text-textColor leading-[1.1] mb-8">
            L'essence de la marketplace
          </h2>

          <p className="font-body text-base text-muted leading-relaxed mb-10">
            Ici, les univers se croisent et se complètent. Nous réunissons une sélection de
            créateurs et de marques, choisis pour leur authenticité et leur savoir-faire. Un
            espace où chaque produit raconte une histoire et où chaque vendeur partage sa vision.
            La diversité comme richesse, la découverte comme expérience.
          </p>

          <a
            href="/boutiques"
            className="group inline-flex items-center gap-2 font-body text-sm text-textColor"
          >
            <span className="relative">
              Devenir vendeur
              <span className="absolute left-0 -bottom-1 h-[1px] w-full bg-textColor origin-left scale-x-100 transition-transform duration-300 group-hover:bg-accent" />
            </span>
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Discovery;