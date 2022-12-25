import { request } from 'umi';

export async function getListZonesAPI() {
  return request('/api/zone', {
    method: 'GET',
  });
}

export async function getListZoneAndAvailableTablesAPI(value: any) {
  return request('/api/zone/available', {
    method: 'GET',
    params: value,
  });
}

export async function createZoneAPI(data: any) {
  return request('/api/zone', {
    method: 'POST',
    data,
  });
}

export async function getZoneByIdAPI(id: string) {
  return request('/api/zone/' + id, {
    method: 'GET',
  });
}

export async function deleteZoneAPI(id: string) {
  return request('/api/zone/' + id, {
    method: 'DELETE',
  });
}
