// frontend/src/components/common/ConfirmModal.jsx
import React, { useEffect } from "react";

export default function ConfirmModal({
  visible,
  title = "Confirmar Acción",
  message = "¿Está seguro?",
  onCancel,
  onConfirm,
  confirmLabel = "Eliminar",   // 🔹 NUEVO: texto configurable del botón
}) {
  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onCancel();
    };

    if (visible) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [visible, onCancel]);

  if (!visible) return null;

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content"
style={{ backgroundColor: "var(--color-cuaternario)", borderRadius: "10px" }}
        >
          <div
            className="modal-header"
style={{ backgroundColor: "var(--color-primario)" }}
          >
            <h5 className="modal-title text-white">{title}</h5>
          </div>

          <div className="modal-body">
            <p>{message}</p>
            <p className="text-muted">Esta acción no se puede deshacer.</p>
          </div>

          <div
            className="modal-footer"
style={{ borderTop: "2px solid var(--color-primario)" }}
          >
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>

            <button
              className="btn"
style={{ backgroundColor: "var(--color-primario)", color: "var(--color-quinary)" }}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
