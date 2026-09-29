import CustomCursor from '../components/CustomCursor';
import Footer from '../components/Footer';
import LoadingScreen from '../components/LoadingScreen';
import Navbar from '../components/Navbar';
import About from '../sections/About';
import Contact from '../sections/Contact';
import Education from '../sections/Education';
import Experience from '../sections/Experience';
import GitHubSection from '../sections/GitHubSection';
import Hero from '../sections/Hero';
import Projects from '../sections/Projects';
import Resume from '../sections/Resume';
import Services from '../sections/Services';
import Skills from '../sections/Skills';
import TechStack3D from '../sections/TechStack3D';

export default function HomePage() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <LoadingScreen />
      <CustomCursor />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Education />
        <Services />
        <Projects />
        <TechStack3D />
        <GitHubSection />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
