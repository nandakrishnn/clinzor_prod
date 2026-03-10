import TopBanner from "./_components/TopBanner";
import Navbar from "./_components/Navbar";
import HeroSection from "./_components/HeroSection";
import ReviewsSection from "./_components/ReviewsSection";
import ConditionsSection from "./_components/ConditionsSection";
import ComparisonSection from "./_components/ComparisonSection";
import CorporateBanner from "./_components/CorporateBanner";
import Footer from "./_components/Footer";
import MobileBanner from "./_components/MobileBanner";

export default function ConnectWithUsPage() {
    return (
        <main className="min-h-screen flex flex-col">
            <TopBanner />
            <Navbar />
            <MobileBanner />
            <HeroSection />
            <ConditionsSection />
            <ComparisonSection />
            <CorporateBanner />
            <ReviewsSection />
            <Footer />
        </main>
    );
}
