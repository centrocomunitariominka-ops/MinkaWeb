import { useEffect, useRef } from "react";
import { FaBold, FaListUl } from "react-icons/fa";

export function RichTextEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = value || "";
    }
    // Solo al montar: no queremos pisar lo que el usuario está escribiendo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(command) {
    document.execCommand(command, false, null);
    ref.current?.focus();
    onChange(ref.current?.innerHTML ?? "");
  }

  return (
    <div className="rich-editor">
      <div className="rich-editor__toolbar">
        <button
          type="button"
          aria-label="Negrita"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("bold")}
        >
          <FaBold />
        </button>
        <button
          type="button"
          aria-label="Lista con viñetas"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("insertUnorderedList")}
        >
          <FaListUl />
        </button>
      </div>
      <div
        ref={ref}
        className="rich-editor__area"
        contentEditable
        data-placeholder={placeholder}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
}
