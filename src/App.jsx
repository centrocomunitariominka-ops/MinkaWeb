import { useEffect, useRef, useState } from "react";
import {
  FaArrowRight,
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaBars,
  FaTimes,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

import logo from "./assets/logo.png";
import logoWhite from "./assets/logo-white.png";
import heroPhoto from "./assets/photos/hero.jpg";
import apoyoEscolarPhoto from "./assets/photos/apoyo-escolar.jpg";
import feriasPhoto from "./assets/photos/ferias-populares.jpg";
import saludPhoto from "./assets/photos/salud-comunitaria.jpg";
import talleresPhoto from "./assets/photos/talleres-creativos.jpg";
import bolsonesPhoto from "./assets/photos/bolsones.jpg";
import voluntariadoPhoto from "./assets/photos/voluntariado.jpg";
import donantePhoto from "./assets/photos/donante.jpg";
import iconEducacion from "./assets/icons/icon-educacion.png";
import iconEconomia from "./assets/icons/icon-economia.png";
import iconSalud from "./assets/icons/icon-salud.png";
import iconBolsones from "./assets/icons/icon-bolsones.png";

import "./App.css";

const WHATSAPP_URL =
  "https://wa.me/5491134414556?text=" +
  encodeURIComponent("Hola, quiero ser voluntario en minka!");

const DONATION_OPTIONS = [
  {
    title: "Débito automático",
    text: "Sumate como donante mensual y sostené los programas todo el año.",
    url: "https://donaronline.org/minka-centro-comunitario/colabora-con-minka-sigamos-construyendo-redes-de-solidaridad?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAb21jcATrMKdwZG9mAmV4dG4DYWVtAjExAHNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp701NMRnEbZa_c3cp8E3qifBMjK6CcKb8-th0425cmjVTNZbrc5jSR4UqLQe_aem_HtAdItdxS5yw9TvqRuXE6A",
    color: "orange",
  },
  {
    title: "Donar $20.000 a Bolsones",
    text: "Un aporte fijo que se convierte directo en un bolsón solidario de alimentos.",
    url: "https://www.mercadopago.com.ar/checkout/v1/payment/redirect/?source=link&router-request-id=18e85f0c-e9d8-4626-880e-4e38f9394209&preference-id=539451835-083a3ae6-e028-45a2-a7f1-0f54690bef0f&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAb21jcATrMNBwZG9mAmV4dG4DYWVtAjExAHNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp701NMRnEbZa_c3cp8E3qifBMjK6CcKb8-th0425cmjVTNZbrc5jSR4UqLQe_aem_HtAdItdxS5yw9TvqRuXE6A",
    color: "red",
  },
  {
    title: "Cualquier monto",
    text: "Elegí vos el monto y colaborá directo por Mercado Pago.",
    url: "https://link.mercadopago.com.ar/minkacc?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAb21jcATrMOxwZG9mAmV4dG4DYWVtAjExAHNydGMGYXBwX2lkDzU2NzA2NzM0MzM1MjQyNwABp701NMRnEbZa_c3cp8E3qifBMjK6CcKb8-th0425cmjVTNZbrc5jSR4UqLQe_aem_HtAdItdxS5yw9TvqRuXE6A",
    color: "blue",
  },
];

const NAV_LINKS = [
  { href: "#impacto", label: "Impacto" },
  { href: "#programas", label: "Programas" },
  { href: "#sumate", label: "Sumate" },
  { href: "#contacto", label: "Contacto" },
];

const STATS = [
  { value: "+140", label: "familias acompañadas", color: "red" },
  { value: "+12", label: "barrios alcanzados", color: "green" },
  { value: "+13", label: "talleres activos", color: "yellow" },
  { value: "+30", label: "voluntarios sumados", color: "purple" },
  { value: "+50", label: "bolsones entregados", color: "blue" },
];

const INFORME_ITEMS = [
  {
    photo: bolsonesPhoto,
    title: "3 entregas de bolsones de alimentos",
    text: "Combinamos asistencia alimentaria con talleres de nutrición, brindando herramientas para una alimentación saludable a las familias del barrio.",
  },
  {
    photo: feriasPhoto,
    title: "3 ferias populares",
    text: "Los aportes del barrio regresan a la comunidad como oportunidades a través de la Feria Popular.",
  },
  {
    photo: saludPhoto,
    title: "3 operativos de oftalmología",
    text: "Se garantizó el acceso gratuito a controles visuales y lentes para vecinxs del barrio, promoviendo el derecho a la salud integral.",
  },
];

const PILARES = [
  {
    icon: iconEducacion,
    title: "Educación popular",
    text: "Apoyo escolar, talleres creativos para adultos y taller de alfabetización.",
    photo: apoyoEscolarPhoto,
    color: "purple",
  },
  {
    icon: iconEconomia,
    title: "Economía solidaria",
    text: "A través de la venta a bajo costo de ropa, libros y artículos del hogar, lo que el barrio aporta vuelve al barrio.",
    photo: feriasPhoto,
    color: "green",
  },
  {
    icon: iconSalud,
    title: "Salud comunitaria",
    text: "Consultorio médico comunitario, psicólogo para adolescentes, fonoaudiología y taller de alimentación.",
    photo: saludPhoto,
    color: "blue",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      className={`reveal${inView ? " is-visible" : ""}${
        className ? ` ${className}` : ""
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Counter({ value, active, duration = 1200 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) {
      setDisplay(0);
      return;
    }

    const start = performance.now();
    let frame;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value, duration]);

  return display;
}

function StatBadge({ value, label, color, delay }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const numeric = parseInt(value.replace(/\D/g, ""), 10);
  const prefix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`stat-badge stat-badge--${color} reveal reveal--pop${
        revealed ? " is-visible" : ""
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="stat-badge__value">
        {prefix}
        <Counter value={numeric} active={inView} />
      </span>
      <span className="stat-badge__label">{label}</span>
    </div>
  );
}

function PilarCard({ icon, title, text, photo, color }) {
  return (
    <article className={`pilar-card pilar-card--${color}`}>
      <div className="pilar-card__photo">
        <img src={photo} alt="" loading="lazy" />
      </div>
      <div className="pilar-card__body">
        <img src={icon} alt="" className="pilar-card__icon" />
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

function DonationModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="donation-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Cerrar"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <span className="eyebrow eyebrow--center">Sumá tu aporte</span>
        <h3 id="donation-modal-title" className="modal-card__title">
          Elegí cómo donar
        </h3>
        <p className="modal-card__subtitle">
          Todos los medios de pago son seguros y llegan directo a los
          programas de MINKA.
        </p>
        <div className="donation-options">
          {DONATION_OPTIONS.map((opt) => (
            <a
              key={opt.title}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`donation-option donation-option--${opt.color}`}
              onClick={onClose}
            >
              <span className="donation-option__title">{opt.title}</span>
              <span className="donation-option__text">{opt.text}</span>
              <span className="donation-option__cta">
                Ir a donar <FaArrowRight />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <a href="#top" className="brand">
            <img src={logo} alt="MINKA Centro Comunitario" className="brand__logo" />
          </a>

          <nav className="main-nav">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => setDonateOpen(true)}
            >
              Donar
            </button>
          </nav>

          <button
            className="nav-toggle"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </header>

      <nav className={`mobile-nav ${menuOpen ? "is-open" : ""}`}>
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            setMenuOpen(false);
            setDonateOpen(true);
          }}
        >
          Donar
        </button>
      </nav>

      <DonationModal open={donateOpen} onClose={() => setDonateOpen(false)} />

      <main id="top">
        <section className="hero">
          <div className="hero__grid">
            <div className="hero__copy">
              <span className="hero__kicker">Tejemos redes solidarias para</span>
              <h1>Transformar la realidad desde el barrio</h1>
              <p>
                <strong>En Minka</strong> creemos que la solidaridad{" "}
                <strong>se construye entre todos.</strong> Con tu apoyo,
                podemos seguir{" "}
                <strong>garantizando salud, educación y alimento</strong> para
                quienes más lo necesitan.
              </p>
              <p>
                <strong>Sumate a esta red que transforma</strong> el barrio
                San Alberto con amor, compromiso y{" "}
                <strong>acción colectiva.</strong>
              </p>
              <div className="hero__actions">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary"
                >
                  Quiero sumarme
                </a>
                <a href="#programas" className="btn btn--ghost">
                  Ver programas
                </a>
              </div>
              <div className="hero__icons">
                {[iconBolsones, iconEducacion, iconSalud, iconEconomia].map(
                  (icon, i) => (
                    <span
                      className="hero__icon-float"
                      style={{ animationDelay: `${i * 0.2}s` }}
                      key={i}
                    >
                      <img src={icon} alt="" />
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="hero__media">
              <img src={heroPhoto} alt="Niñas sonriendo en un evento de MINKA" />
            </div>
          </div>
          <svg className="hero__wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,64 C320,120 1120,0 1440,56 L1440,100 L0,100 Z" fill="var(--cream)" />
          </svg>
        </section>

        <section id="impacto" className="impacto">
          <div className="container">
            <Reveal>
              <span className="eyebrow eyebrow--center">Nuestro impacto</span>
              <h2 className="section-title">Lo que construimos juntos</h2>
            </Reveal>
            <div className="stats-grid">
              {STATS.map((s, i) => (
                <StatBadge key={s.label} {...s} delay={i * 90} />
              ))}
            </div>
          </div>
        </section>

        <section className="informe">
          <div className="container">
            <Reveal>
              <span className="eyebrow eyebrow--center">Informe trimestral</span>
              <h2 className="section-title">Julio – Septiembre</h2>
            </Reveal>
            <div className="informe-grid">
              {INFORME_ITEMS.map((item, i) => (
                <Reveal delay={i * 100} key={item.title}>
                  <article className="informe-card">
                    <div className="informe-card__photo">
                      <img src={item.photo} alt="" loading="lazy" />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
            <div className="informe__cta">
              <a href="#contacto" className="btn btn--primary">
                Descargar informe trimestral
              </a>
            </div>
          </div>
        </section>

        <section id="programas" className="programas">
          <div className="container">
            <Reveal>
              <span className="eyebrow eyebrow--center">Lo que hacemos</span>
              <h2 className="section-title">
                Tejemos redes solidarias para transformar el barrio
              </h2>
            </Reveal>
            <div className="pilares-grid">
              {PILARES.map((p, i) => (
                <Reveal delay={i * 100} key={p.title}>
                  <PilarCard {...p} />
                </Reveal>
              ))}
            </div>

            <Reveal>
              <div className="bolsones-banner">
                <img
                  src={iconBolsones}
                  alt=""
                  className="bolsones-banner__icon"
                />
                <div>
                  <h3>Bolsones solidarios</h3>
                  <p>
                    Entrega de alimentos y productos de primera necesidad a
                    las familias del barrio San Alberto.
                  </p>
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost btn--on-dark"
                >
                  Quiero colaborar
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="sumate" className="sumate">
          <div className="container">
            <Reveal>
              <span className="eyebrow eyebrow--center">Cómo ser parte</span>
              <h2 className="section-title">Sumate a MINKA</h2>
            </Reveal>
            <div className="sumate-grid">
              <Reveal delay={0}>
                <button
                  type="button"
                  className="sumate-card"
                  onClick={() => setDonateOpen(true)}
                >
                  <img
                    src={donantePhoto}
                    alt=""
                    className="sumate-card__photo"
                  />
                  <div className="sumate-card__body">
                    <h3>Ser donante</h3>
                    <p>
                      Tu aporte sostiene los programas y llega directo al
                      barrio.
                    </p>
                    <span className="sumate-card__cta">
                      Quiero donar <FaArrowRight />
                    </span>
                  </div>
                </button>
              </Reveal>
              <Reveal delay={120}>
                <a
                  className="sumate-card"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={voluntariadoPhoto}
                    alt=""
                    className="sumate-card__photo"
                  />
                  <div className="sumate-card__body">
                    <h3>Ser voluntario</h3>
                    <p>Sumá tu tiempo y tus ganas a los talleres y ferias.</p>
                    <span className="sumate-card__cta">
                      Quiero participar <FaArrowRight />
                    </span>
                  </div>
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="testimonio">
          <div className="container testimonio__inner">
            <Reveal>
              <p className="testimonio__text">
                <strong>“Creemos</strong> en la expresión popular y{" "}
                <strong>en la voz de todxs, en la lucha</strong> de quienes
                han sido excluidos”
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <footer id="contacto" className="site-footer">
        <svg className="site-footer__wave" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,32 C320,-16 1120,64 1440,16 L1440,0 L0,0 Z" fill="var(--orange)" />
        </svg>
        <div className="container site-footer__grid">
          <div className="footer-brand">
            <img src={logoWhite} alt="MINKA Centro Comunitario" className="footer-brand__logo" />
            <p>Sumate a esta red que transforma el barrio con amor, compromiso y acción.</p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Enlaces útiles</h4>
            <ul>
              <li><a href="#top">Acerca de MINKA</a></li>
              <li><a href="#programas">Biblioteca de recursos</a></li>
              <li><a href="#">Clasificados San Alberto Newsletter</a></li>
              <li><a href="#">Más información</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li>
                <FaMapMarkerAlt /> Portugal 2388, Ituzaingó, Bs As, Argentina
              </li>
              <li>
                <FaPhoneAlt /> +54 9 11 3441-4556
              </li>
              <li>
                <FaInstagram /> @minkacc
              </li>
            </ul>
          </div>
        </div>
        <p className="site-footer__copy">
          © {new Date().getFullYear()} MINKA Centro Comunitario. Hecho con
          cariño desde el barrio.
        </p>
      </footer>
    </>
  );
}

export default App;
