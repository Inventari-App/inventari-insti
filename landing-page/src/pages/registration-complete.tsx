import { NavLink } from "react-router-dom";

const RegistrationCompletePage = () => {
  return (
    <div className="flex flex-col gap-y-2 w-full min-h-screen justify-center items-center">
      <h3 className="font-bold text-3xl">Gracies per registrar-te!</h3>
      <h5 className="text-lg">
        Ara hauras de validar el teu correu electronic
      </h5>
      <NavLink to="/">
        <button className="py-3 px-10 bg-blue-500 text-white mt-10 rounded">
          Torna
        </button>
      </NavLink>
    </div>
  );
};

export default RegistrationCompletePage;
