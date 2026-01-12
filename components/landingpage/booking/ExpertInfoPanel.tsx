import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import Link from "next/link";

export default function ExpertInfoPanel() {
  return (
    <section className="flex flex-col gap-6 px-2 md:px-8 md:py-10 w-full md:w-[80%]">
      <h2 className="text-balance text-2xl text-center md:text-start md:text-4xl font-bold bg-clip-text">
        Book Online Expert Consultation Video Doctor & Physiotherapy Care
      </h2>

      <div className="mt-4">
        <ul className="space-y-5 my-3 md:my-4">
          <li className="flex gap-3 items-start">
            <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
              <HealthAndSafetyIcon className="45" />
            </span>
            <div>
              <strong>Certified Experts Online</strong>
              <p className="text-gray-500 text-sm">
                Consult verified medical specialists & physiotherapists for pain, posture, recovery, and wellness.
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start">
            <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
              <HealthAndSafetyIcon className="45" />
            </span>
            <div>
              <strong>Secure Video Consultation</strong>
              <p className="text-gray-500 text-sm">
                Get personalized medical advice through a private, easy-to-use online video platform.
              </p>
            </div>
          </li>
          <li className="flex gap-3 items-start">
            <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
              <HealthAndSafetyIcon className="45" />
            </span>
            <div>
              <strong>Care From Home, Anytime</strong>
              <p className="text-gray-500 text-sm">
                Ideal for back pain, joint pain, sports injuries, post-surgery follow-ups & preventive care.
              </p>
            </div>
          </li>
        </ul>
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
