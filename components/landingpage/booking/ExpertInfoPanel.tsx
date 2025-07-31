import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

export default function ExpertInfoPanel() {
  return (
    <section className="flex flex-col gap-6 px-2 md:px-8 md:py-10 w-full md:w-[80%]">
      <h2 className="text-balance text-2xl text-center md:text-start md:text-4xl font-bold bg-clip-text">
        Book an Expert Call
      </h2>
      <p className="text-gray-600 text-center md:text-start">
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
    </section>
  );
}
