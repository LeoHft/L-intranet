// Filtres communs à la page Menu et à l'administration des services.
export default function filterServices(services, { selectedStatus, selectedCategories, searchQuery }) {
  let filtered = services;

  if (selectedStatus?.length > 0) {
    const statusIds = selectedStatus.map((status) => status.value);
    filtered = filtered.filter((service) => statusIds.includes(service.status_id));
  }

  if (selectedCategories?.length > 0) {
    const categoryIds = selectedCategories.map((category) => category.value);
    filtered = filtered.filter((service) =>
      service.categories?.some((category) => categoryIds.includes(category?.id))
    );
  }

  const query = searchQuery?.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter((service) => service.name.toLowerCase().includes(query));
  }

  return filtered;
}
