import { api } from './api';

export const adminService = {
  async login(email, password) {
    const { data } = await api.post('/admin/login', { email, password });
    return data.data;
  },
  async me() {
    const { data } = await api.get('/admin/me');
    return data.data;
  },
  async stats() {
    const { data } = await api.get('/admin/stats');
    return data.data;
  },
  async messages(params) {
    const { data } = await api.get('/admin/messages', { params });
    return data;
  },
  async setRead(id, isRead) {
    const { data } = await api.patch(`/admin/messages/${id}/read`, { isRead });
    return data.data;
  },
  async remove(id) {
    await api.delete(`/admin/messages/${id}`);
  },
};
