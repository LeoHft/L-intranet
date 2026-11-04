import sortServices from "@/utils/sortServices";

// Adresses déjà enregistrées pour ce champ, triées, avec le service qui utilise chacune.
export default function UsedAddresses({ services, field, title, defaultOpen = false }) {
  const used = sortServices(
    services.filter((service) => service[field]),
    { key: field, direction: "asc" }
  );

  if (used.length === 0) return null;

  return (
    <details open={defaultOpen} className="mt-2 rounded-box border border-base-300 px-3 py-2">
      <summary className="cursor-pointer text-sm text-base-content/70">
        {title} ({used.length})
      </summary>
      <ul className="mt-1 max-h-40 overflow-y-auto">
        {used.map((service) => (
          <li key={service.id} className="flex justify-between gap-3 py-1 text-sm">
            <span className="min-w-0 break-all">{service[field]}</span>
            <span className="max-w-[40%] shrink-0 truncate text-base-content/70" title={service.name}>
              {service.name}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
