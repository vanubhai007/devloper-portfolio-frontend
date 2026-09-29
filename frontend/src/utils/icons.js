import { FaCss3Alt, FaGitAlt, FaGithub, FaHtml5, FaJs, FaNodeJs, FaReact } from 'react-icons/fa';
import { SiExpress, SiMongodb, SiMysql, SiRender, SiVercel, SiVite } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import {
  FiBriefcase,
  FiCode,
  FiDatabase,
  FiGlobe,
  FiLayers,
  FiMonitor,
  FiServer,
  FiSmartphone,
  FiTool,
} from 'react-icons/fi';

/** Maps the string keys used in siteConfig to icon components. */
export const techIcons = {
  html: FaHtml5,
  css: FaCss3Alt,
  js: FaJs,
  react: FaReact,
  vite: SiVite,
  responsive: FiSmartphone,
  node: FaNodeJs,
  express: SiExpress,
  api: FiServer,
  mongodb: SiMongodb,
  mysql: SiMysql,
  git: FaGitAlt,
  github: FaGithub,
  vscode: VscVscode,
  vercel: SiVercel,
  render: SiRender,
};

export const serviceIcons = {
  web: FiGlobe,
  stack: FiLayers,
  react: FaReact,
  api: FiServer,
  db: FiDatabase,
  responsive: FiSmartphone,
  business: FiBriefcase,
  maintenance: FiTool,
};

export const FallbackIcon = FiCode;
export const MonitorIcon = FiMonitor;
