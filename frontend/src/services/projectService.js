import { api } from './api';

export async function fetchProjects() {
  const { data } = await api.get('/projects');
  return data.data;
}
