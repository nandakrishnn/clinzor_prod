import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import Link from "next/link";

export default function ExpertInfoPanel() {
  return (
    <section className="flex flex-col gap-6 px-2 md:px-8 md:py-10 w-full md:w-[80%]">
      <h2 className="text-balance text-2xl text-center md:text-start md:text-4xl font-bold bg-clip-text">
        Book an Expert Call
      </h2>
      <p className="text-gray-600 text-center md:text-start text-justify">
        Get personalized medical advice from top specialists through a secure
        video consultation. It’s simple, convenient, and effective.
      </p>
      <ul className="space-y-5 my-3 md:my-0">
        <li className="flex gap-3 items-start">
          <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
            <HealthAndSafetyIcon className="45" />
          </span>
          <div>
            <strong>1. Find Your Expert</strong>
            <p className="text-gray-500 text-sm">
              Search for specialists based on their expertise and patient
              reviews.
            </p>
          </div>
        </li>
        <li className="flex gap-3 items-start">
          <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
            <HealthAndSafetyIcon className="45" />
          </span>
          <div>
            <strong>2. Select a Slot</strong>
            <p className="text-gray-500 text-sm">
              Choose a date and time that works for you from the expert’s
              available slots.
            </p>
          </div>
        </li>
        <li className="flex gap-3 items-start">
          <span className="text-primaryColor text-xl bg-blueLight/20 rounded-full w-8 h-8 flex items-center justify-center p-5">
            <HealthAndSafetyIcon className="45" />
          </span>
          <div>
            <strong>3. Join the Call</strong>
            <p className="text-gray-500 text-sm">
              Receive a secure link to join your video consultation at the
              scheduled time.
            </p>
          </div>
        </li>
      </ul>


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
