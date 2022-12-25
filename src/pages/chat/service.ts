import { request } from 'umi';

export async function getListGroupsAPI() {
  return request('/api/chat/group', {
    method: 'GET',
  });
}

export async function getGroupOfCurrentUserAPI() {
  return request('/api/chat/group-of-current-user', {
    method: 'GET',
  });
}

export async function getListChatAPI(groupId: string) {
  return request('/api/chat/' + groupId, {
    method: 'GET',
  });
}

export async function createChatAPI(data: any) {
  return request('/api/chat', {
    method: 'POST',
    data,
  });
}
