import { Trash2 } from "lucide-react";
import { useState } from "react";
import Modal from "@/Components/Utils/Modal";
import { getIcon } from "@/utils/icons";
import safeUrl from "@/utils/safeUrl";

export default function Shortcut({ shortcut, className = "", onDelete }) {
  const IconComponent = getIcon(shortcut.icon);
  const url = safeUrl(shortcut.url);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(shortcut.id);
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="indicator">
        <span
          className="indicator-item badge badge-xs badge-error cursor-pointer"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 className="h-2 w-2" />
        </span>
        <div className="tooltip tooltip-bottom" data-tip={`${shortcut.name ? `${shortcut.name}` : `${shortcut.url}`}`}>
          <button
            disabled={!url}
            onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
            className={`btn btn-soft btn-circle hover:btn-primary transition-all duration-200 ${className}`}
            aria-label={`Ouvrir ${shortcut.url}`}
          >
            {IconComponent && <IconComponent className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Supprimer le raccourci</h2>
            <p>
              Êtes-vous sûr de vouloir supprimer ce raccourci vers{" "}
              <strong>{shortcut.url}</strong> ?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                className="btn btn-ghost"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
