import { FaUser, FaRocket, FaTrophy } from "react-icons/fa";

export default function StepsSection() {
  const steps = [
    { step: 1, text: "Registra't com administrador del teu centre aqui mateix fent servir el correu corporatiu", icon: <FaUser /> },
    { step: 2, text: "Configura el teu centre", icon: <FaTrophy /> },
    { step: 3, text: "Afegeix els usuaris de cada departament", icon: <FaRocket /> },
    { step: 4, text: "Comenca a gestionar el teu inventari", icon: <FaRocket /> },
  ];

  return (
    <div className="py-16 px-4 bg-blue-50">
      <h2 className="text-3xl font-bold text-center mb-12">Com funciona</h2>
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-10 px-10">
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

