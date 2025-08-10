
import { PlatformIntro } from "./PlatformIntro";
import { HowItWorks } from "./HowItWorks";
import { StatsSection } from "./StatsSection";
import { VideoConsultation } from "./VideoConsultation";

const AboutUs = () => {
  return (
    <>
      {/* Platform Introduction */}
      <PlatformIntro />

      {/* How it works */}
      <HowItWorks />

      {/* Stats Section */}
      <StatsSection />

      {/* Video Consultation */}
      <VideoConsultation />

    </>
  );
};

export default AboutUs;
