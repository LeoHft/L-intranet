import { apiClient } from '@/api/apiClient';

export const getBarStatByUserByServiceByDate = async (selectedService, selectedUsers, selectedLinkType, startDate, endDate) => {
  console.log("Récupération des statistiques en cours ...");
  
  try {
    const params = {
        startDate,
        endDate
    };

    // Ajouter serviceId seulement si sélectionné
    if (selectedService && selectedService.length > 0) {
        params.serviceId = Array.isArray(selectedService) 
            ? selectedService.map(service => service.id || service.value) 
            : [selectedService.id || selectedService.value];
    }

    // Ajouter userIds seulement si sélectionné
    if (selectedUsers && selectedUsers.length > 0) {
        params.userIds = selectedUsers.map(user => user.id || user.value);
    }

    // Ajouter linkTypes seulement si sélectionné
    if (selectedLinkType && selectedLinkType.length > 0) {
        params.linkTypes = selectedLinkType.map(type => type.value);
    }

    const response = await apiClient.get('/getStatByUserByServiceByDate', {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    });
    
    return response.data;

  } catch (error) {
    const message = error.response?.data?.error || error.response?.data?.message || "Erreur lors de la récupération des statistiques";
    console.error('Erreur API statistiques:', error.response?.data);
    throw new Error(message);
  }
}