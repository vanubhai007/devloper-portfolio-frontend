import { useEffect, useState } from 'react';
import { FiArrowUpRight, FiGithub, FiStar } from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { siteConfig } from '../config/siteConfig';
import styles from './GitHubSection.module.css';

const USER = siteConfig.githubUsername;

// Repos from siteConfig — shown instantly and used if the GitHub API is unavailable.
const FALLBACK_REPOS = siteConfig.projects
  .flatMap((p) => [p.repoUrl, p.backendRepoUrl])
  .filter(Boolean)
  .map((url) => ({ name: url.split('/').pop(), html_url: url, description: '', language: null, stargazers_count: null }));

/** Fetches public GitHub data (no token needed; 60 req/hour per visitor IP). */
function useGitHub() {
  const [state, setState] = useState({ profile: null, repos: FALLBACK_REPOS, live: false });
  useEffect(() => {
    const controller = new AbortController();
    const get = (path) =>
      fetch(`https://api.github.com${path}`, { signal: controller.signal }).then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      });
    Promise.all([get(`/users/${USER}`), get(`/users/${USER}/repos?sort=updated&per_page=6`)])
      .then(([profile, repos]) => {
        const publicRepos = repos.filter((r) => !r.fork);
        setState({ profile, repos: publicRepos.length ? publicRepos : FALLBACK_REPOS, live: true });
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return state;
}

export default function GitHubSection() {
  const { profile, repos, live } = useGitHub();

  return (
    <section id="github" className="section" aria-labelledby="github-title">
      <div className="container">
        <SectionHeading
          id="github-title"
          eyebrow="08 — Open source"
          title="On"
          highlight="GitHub."
          subtitle="Every project I build is version-controlled with Git and pushed to GitHub."
        />
        <div className={styles.grid}>
          <Reveal>
            <GlassCard className={styles.profile} interactive={false}>
              <div className={styles.who}>
                {profile?.avatar_url ? (
                  <img className={styles.avatar} src={profile.avatar_url} alt={`${USER} GitHub avatar`} width="64" height="64" loading="lazy" />
                ) : (
                  <span className={`${styles.avatar} ${styles.avatarFallback}`} aria-hidden="true">
                    <FiGithub />
                  </span>
                )}
                <div>
                  <p className={styles.handle}>@{USER}</p>
                  <span className={styles.handleSub}>{profile?.name || siteConfig.role}</span>
                </div>
              </div>
              {live && (
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <strong>{profile.public_repos}</strong>
                    <span>Repos</span>
                  </div>
                  <div className={styles.stat}>
                    <strong>{profile.followers}</strong>
                    <span>Followers</span>
                  </div>
                  <div className={styles.stat}>
                    <strong>{profile.following}</strong>
                    <span>Following</span>
                  </div>
                </div>
              )}
              <pre className={styles.terminal} aria-label="Git workflow example">
                <b>$</b> git checkout -b feature/booking{'\n'}
                <b>$</b> git commit -m &quot;feat: add booking API&quot;{'\n'}
                <b>$</b> git push origin feature/booking
              </pre>
              <a className="btn btn-primary" href={siteConfig.socialLinks.github} target="_blank" rel="noopener noreferrer">
                <FiGithub aria-hidden="true" /> View GitHub Profile
              </a>
            </GlassCard>
          </Reveal>

          <div>
            <ul className={styles.repos}>
              {repos.map((repo, i) => (
                <Reveal as="li" key={repo.name} delay={i * 0.05}>
                  <GlassCard className={styles.repo}>
                    <h3 className={styles.repoName}>
                      <FiGithub aria-hidden="true" />
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        {repo.name}
                      </a>
                      <FiArrowUpRight aria-hidden="true" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                    </h3>
                    <p className={styles.repoDesc}>{repo.description || 'Source code repository.'}</p>
                    <div className={styles.repoMeta}>
                      {repo.language && <span className={styles.lang}>{repo.language}</span>}
                      {repo.stargazers_count !== null && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <FiStar aria-hidden="true" /> {repo.stargazers_count}
                        </span>
                      )}
                    </div>
                  </GlassCard>
                </Reveal>
              ))}
            </ul>
            {!live && <p className={styles.note}>Showing project repositories. Live GitHub stats load when available.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
