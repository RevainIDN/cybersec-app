import './HomePage.css';
import HeroSection from '../../components/Landing/LandingComponents/HeroSection';
import ServicesSection from '../../components/Landing/LandingComponents/ServicesSection';
import ProtectionToolsSection from '../../components/Landing/LandingComponents/ProtectionToolsSection';
import ThreatCaseSection from '../../components/Landing/LandingComponents/ThreatCaseSection';

export default function HomePage() {
	return (
		<>
			<HeroSection />
			<ServicesSection />
			<ProtectionToolsSection />
			<ThreatCaseSection />
		</>
	)
}