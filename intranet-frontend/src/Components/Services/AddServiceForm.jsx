import PrimaryButton from "@/Components/Utils/PrimaryButton";
import ServiceFormModal from "@/Components/Services/ServiceFormModal";

import { useState } from "react";

export default function AddServiceForm({ onServiceAdded }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="shrink-0">
      <PrimaryButton className="lg:h-12" onClick={() => setShowModal(true)}> Ajouter un service </PrimaryButton>

      {showModal && (
        <ServiceFormModal onClose={() => setShowModal(false)} onSuccess={onServiceAdded} />
      )}
    </section>
  );
}
