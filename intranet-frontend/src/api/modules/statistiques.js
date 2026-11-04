import { apiClient } from '@/api/apiClient';

const values = (selection) => (selection ?? []).map((option) => option.value);

export const getBarStatByUserByServiceByDate = async (selectedService, selectedUsers, selectedLinkType, startDate, endDate) => {
    const response = await apiClient.get('/getStatByUserByServiceByDate', {
        params: {
            startDate,
            endDate,
            serviceId: values(selectedService),
            userIds: values(selectedUsers),
            linkTypes: values(selectedLinkType),
        },
    });
    return response.data;
}
