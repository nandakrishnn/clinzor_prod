import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import Link from "next/link";

export default function ExpertInfoPanel() {
  return (
    <section className="flex flex-col gap-6 px-2 md:px-8 md:py-10 w-full md:w-[80%]">
      <h2 className="text-balance text-2xl text-center md:text-start md:text-4xl font-bold bg-clip-text">
        Book an Online Expert Consultation
      </h2>
      <h3 className="text-lg font-semibold text-gray-700 text-center md:text-start">
        Secure Video Consultation with Certified Medical & Physiotherapy Specialists
      </h3>
      <p className="text-gray-600 text-center md:text-start text-justify leading-relaxed">
        Book an online expert consultation with experienced medical and physiotherapy specialists through Clinzor’s secure video consultation platform. Get personalized medical advice, diagnosis guidance, and recovery recommendations from the comfort of your home.
      </p>

      <div className="mt-4">
        <h4 className="font-bold text-lg text-[#424141]">Why Choose Clinzor Online Expert Consultation?</h4>
        <ul className="mt-2 space-y-2 text-sm text-gray-600 list-disc ml-5">
          <li>Consult certified specialists and physiotherapists online</li>
          <li>Get personalized treatment advice for pain, mobility, and recovery</li>
          <li>Secure, private, and easy-to-use video consultation system</li>
          <li>Ideal for follow-ups, second opinions, and preventive care</li>
        </ul>
      </div>

      <div className="mt-4">
        <h4 className="font-bold text-lg text-[#424141]">How to Book an Online Video Consultation</h4>
        <ul className="space-y-5 my-3 md:my-4">
          <li className="flex gap-3 items-start">
            <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
              <HealthAndSafetyIcon className="45" />
            </span>
            <div>
              <strong>1. Find the Right Medical Expert</strong>
              <p className="text-gray-500 text-sm">
                Search and choose from a network of verified specialists based on expertise, experience, and real patient reviews to ensure trusted online medical consultation.
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start">
            <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
              <HealthAndSafetyIcon className="45" />
            </span>
            <div>
              <strong>2. Select a Convenient Time Slot</strong>
              <p className="text-gray-500 text-sm">
                Pick a suitable date and time for your online video consultation from the expert’s available schedule.
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start">
            <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
              <HealthAndSafetyIcon className="45" />
            </span>
            <div>
              <strong>3. Join Secure Video Consultation</strong>
              <p className="text-gray-500 text-sm">
                Receive a secure link to join your online expert consultation and connect with the specialist for one-on-one medical guidance and personalized care.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="mt-4">
        <h4 className="font-bold text-lg text-[#424141]">Conditions You Can Consult For Online</h4>
        <ul className="mt-2 space-y-2 text-sm text-gray-600 list-disc ml-5">
          <li>Back pain, neck pain & joint pain</li>
          <li>Posture issues & musculoskeletal disorders</li>
          <li>Sports injuries & rehabilitation guidance</li>
          <li>Post-surgical recovery & follow-ups</li>
          <li>Preventive physiotherapy & wellness advice</li>
        </ul>
      </div>

      <div className="mt-6">
        <h4 className="font-bold text-lg text-[#424141]">Book Your Online Expert Call Today</h4>
        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
          Get trusted medical and physiotherapy advice without clinic visits. Clinzor’s online expert consultation offers convenience, safety, and expert care anytime, anywhere.
        </p>
      </div>

      <Link href="/expert-call" className="block mt-4">
        <button className="w-full md:w-fit md:px-5 bg-primaryColor text-white p-2.5 text-sm rounded-full hover:bg-primaryColor transition-colors shadow-md hover:shadow-lg transform active:scale-95 transition-all duration-200 flex items-center justify-center gap-2">
          <span>Book Expert Now</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </Link>
    </section>
  );
}
