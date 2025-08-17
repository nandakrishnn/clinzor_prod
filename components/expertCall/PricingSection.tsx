import { Button } from "@/components/ui/button";
import Title from "../ui/title";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      duration: "30 min",
      price: "₹499",
      features: [
        "Quick consultation",
        "General advice",
        "Basic strategy",
        "Email follow-up"
      ],
      popular: false
    },
    {
      name: "Standard",
      duration: "60 min",
      price: "₹899",
      features: [
        "In-depth discussion",
        "Personalized plan",
        "Resource recommendations",
        "Email + 1-week support"
      ],
      popular: true
    },
    {
      name: "Extended",
      duration: "90 min",
      price: "₹1299",
      features: [
        "Comprehensive session",
        "Detailed action plan",
        "Priority support",
        "Follow-up checklist",
        "30-day email support"
      ],
      popular: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <Title
          title="Pricing"
          description={"Flexible Pricing Options"}
          subtitle={`Choose the session length that fits your needs and budget.`}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-xl p-8 border-2 ${
              plan.popular
                ? "border-primaryColor shadow-lg"
                : "border-gray-200 shadow-sm"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-primaryColor text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-lg">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {plan.name}
            </h3>
            <p className="text-gray-600 mb-6">{plan.duration} session</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-gray-900">
                {plan.price}
              </span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className={`w-full ${
                plan.popular
                  ? "bg-primaryColor hover:bg-primaryColor text-white"
                  : "bg-white border border-primaryColor  hover:bg-primaryColor hover:text-white"
              }`}
            >
              Choose Plan
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-gray-600">
        <p>Need a custom package? Contact us for enterprise solutions.</p>
      </div>
    </div>
  );
};

export default PricingSection;
