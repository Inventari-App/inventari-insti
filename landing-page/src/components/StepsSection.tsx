import { FaUser, FaRocket, FaTrophy } from "react-icons/fa";

export default function StepsSection() {
  const steps = [
    { step: 1, text: "Sign Up for an Account", icon: <FaUser /> },
    { step: 2, text: "Explore Our Features", icon: <FaRocket /> },
    { step: 3, text: "Achieve Your Goals", icon: <FaTrophy /> },
  ];

  return (
    <div className="py-16 px-4 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {steps.map(({ step, text, icon }) => (
          <div
            key={step}
            className="bg-white shadow-lg p-6 rounded-lg text-center transform hover:scale-105 transition-transform"
          >
            <div className="text-4xl text-blue-600 mb-4">{icon}</div>
            <div className="text-4xl font-bold text-gray-800 mb-2">{step}</div>
            <p className="text-gray-600">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

