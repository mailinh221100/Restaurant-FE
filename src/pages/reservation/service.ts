import { request } from 'umi';

export async function getListReservationsAPI(query: any) {
  return request('/api/reservation', {
    method: 'GET',
    params: query,
  });
}

export async function createReservationAPI(data: any) {
  return request('/api/reservation', {
    method: 'POST',
    data,
  });
}

export async function updateStatusReservationAPI(id: string, status: string) {
  return request(`/api/reservation/${id}/${status}`, {
    method: 'PATCH',
  });
}
