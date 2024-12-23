import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

interface FormData extends Record<string, any> {
  email: string;
  name: string;
  surname: string;
  password: string;
  repeatPassword: string;
}

export default function RegisterForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    surname: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword) {
      alert("Els passwords no coincideixen");
      return;
    }
    const { error } = await fetch(
      "http://localhost:3000/register-center",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    )
      .then((res) => res.json())
      .catch((res) => res.json());


      if (error) {
        toast.error(error.message)
      } else {
        toast.success("L'usuari ha estat registrat correctament")
        navigate("/registration-complete")
      }
  };

  return (
    <div id="register" className="py-16 px-4 bg-blue-50">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center mb-12">Registre d'Administradors</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white shadow-lg p-8 rounded-lg"
      >
        {[
          { label: "Email", name: "email", type: "email", placeholder: "Email corporatiu del teu centre" },
          { label: "Nom", name: "name", type: "text", placeholder: "Nom del Administrador" },
          { label: "Cognoms", name: "surname", type: "text", placeholder: "Cognoms del Administrador" },
          { label: "Password", name: "password", type: "password", placeholder: "Password" },
          { label: "Repeteix Password", name: "repeatPassword", type: "password", placeholder: "Repeteix Password" },
        ].map(({ label, name, type, placeholder }) => (
          <div className="mb-6" key={name}>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder={placeholder}
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700"
        >
          Registra't
        </button>
      </form>
    </div>
  );
}
