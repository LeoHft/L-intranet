import * as Icons from "lucide-react";
import Shortcut from "@/Components/Utils/Shortcut";
import {
  getUserShortcuts,
  addShortcut,
  deleteShortcut,
} from "@/api/modules/shortcut";
import React, { useState, useEffect } from "react";
import Modal from "@/Components/Utils/Modal";
import InputLabel from "@/Components/Utils/InputLabel";
import { motion } from "motion/react";

export default function ListShortcuts() {
  const [shortcuts, setShortcuts] = useState([]);
  const [showAddShortcut, setShowAddShortcut] = useState(false);
  const [newShortcut, setNewShortcut] = useState({ url: "", icon: "" });
  const [iconSearch, setIconSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchShortcuts();
  }, []);

  const fetchShortcuts = () => {
    getUserShortcuts()
      .then((response) => {
        setShortcuts(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des shortcuts:", error);
      });
  };

  const showAddShortcutForm = () => {
    setShowAddShortcut(true);
  };

  const handleAddShortcut = (e) => {
    setIsLoading(true);
    e.preventDefault();
    addShortcut(newShortcut)
      .then((response) => {
        setShortcuts([...shortcuts, response.data]);
        setNewShortcut({ url: "", icon: "" });
        setIsLoading(false);
        setShowAddShortcut(false);
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du shortcut:", error);
        setIsLoading(false);
      });
  };

  const handleDeleteShortcut = (id) => {
    deleteShortcut(id)
      .then(() => {
        setShortcuts(shortcuts.filter((shortcut) => shortcut.id !== id));
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du shortcut:", error);
      });
  };

  // Récupérer toutes les icônes disponibles
  const availableIcons = Object.keys(Icons).filter(
    (key) => key !== "createLucideIcon" && key !== "default"
  );

  // Filtrer les icônes selon la recherche
  const filteredIcons = availableIcons.filter((iconName) =>
    iconName.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center gap-2 pr-2">
        {shortcuts &&
          shortcuts.length > 0 &&
          shortcuts.map((shortcut, index) => (
            <motion.div
              key={shortcut.id}
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                transition: {
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: [0.34, 1.56, 0.64, 1]
                }
              }}
              whileHover={{
                y: -2,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <Shortcut
                id={shortcut.id}
                url={shortcut.url}
                icon={shortcut.icon}
                onDelete={handleDeleteShortcut}
              />
            </motion.div>
          ))}

        {shortcuts && shortcuts.length < 10 && (
          <motion.button
            className="btn btn-circle"
            onClick={showAddShortcutForm}
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: shortcuts.length * 0.1,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          >
            +
          </motion.button>
        )}
      </div>

      {showAddShortcut && (
        <Modal show={showAddShortcut} onClose={() => setShowAddShortcut(false)}>
          <form onSubmit={handleAddShortcut} className="space-y-4">
            <h1 className="text-lg font-medium">Ajouter un shortcut</h1>
            <div className="form-control">
              <InputLabel htmlFor="url" value="Lien du shortcut"/><span className="text-error">*</span>
              <input
                type="url"
                id="url"
                value={newShortcut.url}
                onChange={(e) =>
                  setNewShortcut({ ...newShortcut, url: e.target.value })
                }
                className="w-full input input-bordered focus:input-primary"
                placeholder="https://example.com"
                required
              />
            </div>
            <div className="form-control">
              <InputLabel htmlFor="icon" value="Icône"/><span className="text-error">*</span>
              <input
                id="icon-search"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                type="text"
                className="w-full input input-bordered focus:input-primary mb-2"
                placeholder="Rechercher une icône..."
              />
              <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto border rounded p-2">
                {filteredIcons.slice(0, 48).map((iconName) => {
                  const IconComponent = Icons[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() =>
                        setNewShortcut({ ...newShortcut, icon: iconName })
                      }
                      className={`p-2 rounded hover:bg-gray-200 flex flex-col items-center ${
                        newShortcut.icon === iconName ? "bg-blue-200" : ""
                      }`}
                      title={iconName}
                    >
                      <IconComponent size={24} />
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!newShortcut.icon || isLoading}
            >
              {isLoading ? "Ajout en cours..." : "Ajouter"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
