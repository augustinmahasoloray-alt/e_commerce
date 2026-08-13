import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTiktok, FaPinterestP } from "react-icons/fa6";

const columns = [
  {
    title: "Marketplace",
    links: [
      { to: "/marketplace", label: "Explorer" },
      { to: "/categories", label: "Catégories" },
      { to: "/collections", label: "Collections" },
      { to: "/nouveautes", label: "Nouveautés" },
      { to: "/meilleures-ventes", label: "Meilleures ventes" },
    ],
  },
  {
    title: "Pour les vendeurs",
    links: [
      { to: "/vendeur/apply", label: "Devenir vendeur" },
      { to: "/vendeur/ouvrir-boutique", label: "Ouvrir une boutique" },
      { to: "/vendeur/dashboard", label: "Espace vendeur" },
      { to: "/vendeur/conditions", label: "Conditions pour les vendeurs" },
    ],
  },
  {
    title: "À propos",
    links: [
      { to: "/apropos/histoire", label: "Notre histoire" },
      { to: "/apropos/philosophie", label: "Notre philosophie" },
      { to: "/apropos/engagements", label: "Engagements" },
      { to: "/vendeur/apply", label: "Rejoindre la marketplace" },
    ],
  },
  {
    title: "Aide",
    links: [
      { to: "/aide", label: "Centre d'aide" },
      { to: "/aide/livraison", label: "Livraison" },
      { to: "/aide/retours", label: "Retours" },
      { to: "/aide/paiement", label: "Paiement sécurisé" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Légal",
    links: [
      { to: "/legal/cgv", label: "Conditions générales" },
      { to: "/legal/confidentialite", label: "Politique de confidentialité" },
      { to: "/legal/cookies", label: "Cookies" },
    ],
  },
];

const socials = [
  { Icon: FaInstagram, label: "Instagram", href: "#" },
  { Icon: FaFacebookF, label: "Facebook", href: "#" },
  { Icon: FaTiktok, label: "TikTok", href: "#" },
  { Icon: FaPinterestP, label: "Pinterest", href: "#" },
];

const columnTitleClass = "font-headline text-sm tracking-[0.15em] uppercase text-textColor mb-5";
const linkClass = "font-body text-sm text-muted hover:text-accent transition-colors duration-300";

function Footer() {
  const annee = new Date().getFullYear();

  return (
    <footer className="bg-backgroundColor text-textColor w-full border-t border-muted/10">
      <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40 py-16">
        {/* Bloc marque */}
        <div className="mb-14">
          <h2 className="text-2xl font-headline tracking-wide mb-3">
            StepUp<span className="text-accent">.shop</span>
          </h2>
          <p className="font-body text-sm text-muted">
            L'élégance de la découverte.
          </p>
        </div>

        {/* Colonnes de liens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className={columnTitleClass}>{col.title}</h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className={linkClass}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Barre du bas */}
      <div className="border-t border-muted/10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40 py-6">
          <p className="font-body text-xs text-muted">
            © {annee} StepUp. Tous droits réservés.
          </p>

          <div className="flex items-center gap-3">
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-surfaceColor text-muted hover:text-accent transition-colors duration-300"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>

          <p className="font-body text-xs text-muted">
            Paiement sécurisé via MVola & Orange Money
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;