import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";

const navLinkClass =
  "relative text-textColor transition-colors duration-300 hover:text-accent whitespace-nowrap " +
  "after:content-[''] after:absolute after:left-0 after:-bottom-1 " +
  "after:h-[2px] after:w-0 after:bg-accent after:transition-all after:duration-300 " +
  "hover:after:w-full";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/categorie", label: "Categorie" },
  { to: "/arrivage", label: "Arrivage" },
  { to: "/promotion", label: "Promotion" },
  { to: "/page", label: "Pages" },
  { to: "/apropos", label: "A Propos" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const menuRef = useRef(null);
  const iconsRef = useRef(null);

  const checkCollision = useCallback(() => {
    if (!containerRef.current || !logoRef.current || !menuRef.current || !iconsRef.current) return;

    const available = containerRef.current.clientWidth;
    const needed =
      logoRef.current.scrollWidth +
      menuRef.current.scrollWidth +
      iconsRef.current.scrollWidth +
      100;

    setIsCollapsed(needed > available);
  }, []);

  useEffect(() => {
    checkCollision();
    const observer = new ResizeObserver(checkCollision);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener("resize", checkCollision);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkCollision);
    };
  }, [checkCollision]);

  return (
    <nav className="bg-backgroundColor shadow-md w-full h-20 flex items-center fixed z-50 font-body text-textColor px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-40">
      <div ref={containerRef} className="flex justify-between items-center h-full w-full relative">

        {/* Bloc gauche : burger (si collapsed) + logo */}
        <div className="flex items-center gap-4 shrink-0">
          {isCollapsed && (
            <button onClick={() => setIsOpen(true)}>
              <Menu size={25} />
            </button>
          )}

          {/* Logo original — reste monté pour la mesure, invisible si collapsed */}
          <div ref={logoRef} className={isCollapsed ? "invisible" : ""}>
            <h1 className="text-3xl font-headline">
              Augment.
              <span className="text-2xl font-body text-accent">shop</span>
            </h1>
          </div>
        </div>

        {/* Logo centré, affiché uniquement en mode collapsed */}
        {isCollapsed && (
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
            <h1 className="text-3xl font-headline">
              Augment.
              <span className="text-2xl font-body text-accent">shop</span>
            </h1>
          </div>
        )}

        {/* Menu desktop réel (visible seulement si pas collapsed) */}
        {!isCollapsed && (
          <div className="flex flex-1 justify-center items-center gap-10 h-full text-xl">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className={navLinkClass}>
                {l.label}
              </Link>
            ))}
          </div>
        )}

        {/* Icônes (toujours visibles) */}
        <div ref={iconsRef} className="flex items-center gap-5 text-accent shrink-0">
          <Search size={30} className="cursor-pointer hover:scale-110 transition-transform duration-200" />
          <div className="relative cursor-pointer hover:scale-110 transition-transform duration-200">
            <ShoppingCart size={30} />
            <span className="absolute -top-3 left-5 bg-accent text-backgroundColor w-5 h-5 flex justify-center items-center rounded-full animate-bounce">
              2
            </span>
          </div>
          <User size={30} className="cursor-pointer hover:scale-110 transition-transform duration-200" />
        </div>

        {/* Menu fantôme (invisible, sert uniquement à mesurer la largeur naturelle) */}
        <div
          ref={menuRef}
          className="flex items-center gap-10 text-xl absolute opacity-0 pointer-events-none -z-10"
          aria-hidden="true"
        >
          {links.map((l) => (
            <span key={l.to} className="whitespace-nowrap">{l.label}</span>
          ))}
        </div>

      </div>

      {/* Overlay mobile */}
      <div
        className={`
          fixed inset-0 bg-backgroundColor z-100
          flex flex-col items-center justify-center
          transition-all duration-300 ease-in-out transform
          ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}
        `}
      >
        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 z-110">
          <X size={28} />
        </button>

        <div className="flex flex-col items-center gap-8 text-2xl">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setIsOpen(false)} className={navLinkClass}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;