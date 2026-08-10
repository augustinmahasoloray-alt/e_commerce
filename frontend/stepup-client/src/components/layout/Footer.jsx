import { FaFacebook, FaLinkedin, FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom"
function Footer() {

    const navLinkClass =
        "relative text-xl text-left font-body transition-colors duration-300 hover:text-accent whitespace-nowrap " +
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

    return (
        <>
            <div className="w-full flex flex-col items-center gap-5 border-t-2 border-border font-body">

                {/* partie 1 : newsletter */}
                <div className="flex flex-col items-center mt-8 size-body gap-8 w-full">

                    <div className="flex flex-col items-center text-center">
                        <h2 className="font-headline text-3xl">Rejoignez notre newsletter</h2>
                        <p className="size-body text-textheadline">
                            Nous vous enverrons une belle lettre une fois par semaine.
                        </p>
                    </div>

                    <div className="w-full max-w-2xl px-4 flex justify-between items-center gap-6">
                        <input
                            type="email"
                            placeholder="Entrer votre e-mail"
                            className="animation-hover px-8 py-2 rounded-2xl shadow-[4px_-2px_10px_rgba(0,0,0,0.2)] w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:translate-y-1 focus:ring-2 focus:ring-accent"
                        />
                        <button className="animation-hover px-8 py-2 rounded-2xl bg-accent text-backgroundColor shadow-[4px_-2px_10px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 active:bg-border active:text-primary whitespace-nowrap">
                            S'abonner
                        </button>
                    </div>
                </div>

                {/* partie 2 : liens + contact */}
                <div className="flex flex-col w-full items-center gap-10 px-4 py-10">

                    <div className="flex flex-wrap justify-center items-center gap-10 text-xl">
                        {links.map((l) => (
                            <Link key={l.to} to={l.to} className={navLinkClass}>
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center items-center sm:items-center gap-20 w-full max-w-3xl text-textheadline">

                        <div className="flex flex-col justify-start items-start gap-2 text-xl">
                            <div>
                                <p className="flex items-center gap-3">
                                    <FaPhone className="text-textheadline" />
                                    +261 38 79 416 00
                                </p>
                                <p className="flex items-center gap-3">
                                    <FaEnvelope className="text-textheadline" />
                                    contact@stepup.com
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center gap-2 text-xl">
                            <div>
                                <p className="flex items-center justify-center">
                                    101 Antananarivo, 
                                </p>
                                <p className="flex items-center justify-cente">
                                    ASFOR Ampandrianomby,
                                </p>
                                <p className="flex items-center justify-cente">
                                    à coté du Ministère des Mines
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* partie 3 : copyright */}
                <div className="w-full border-t border-border py-4 text-center text-sm text-textheadline">
                    © 2026 StepUp — Tous droits réservés
                </div>
            </div>
        </>
    );
}

export default Footer;

