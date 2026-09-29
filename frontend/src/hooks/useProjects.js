import { useEffect, useState } from 'react';
import { siteConfig } from '../config/siteConfig';
import { fetchProjects } from '../services/projectService';

/**
 * Projects from siteConfig render instantly. If the API returns projects
 * (managed in MongoDB), they replace the local list. Any API failure is
 * silent — the local list is always a valid fallback.
 */
export function useProjects() {
  const [projects, setProjects] = useState(siteConfig.projects);

  useEffect(() => {
    let cancelled = false;
    fetchProjects()
      .then((remote) => {
        if (!cancelled && Array.isArray(remote) && remote.length > 0) setProjects(remote);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return projects;
}
