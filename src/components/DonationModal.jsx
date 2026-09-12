import { useEffect } from "react";
import { FaArrowRight, FaTimes } from "react-icons/fa";

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

export function DonationModal({ open, onClose }) {
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
