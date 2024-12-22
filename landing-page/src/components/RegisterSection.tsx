import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

interface FormData {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword) {
      alert("Passwords do not match!");
      return;
    }
    const { success, data, error } = await fetch(
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
    <div id="register" className="py-16 px-4">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center mb-12">Register</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white shadow-lg p-8 rounded-lg"
      >
        {[
          { label: "Email", name: "email", type: "email" },
          { label: "Name", name: "name", type: "text" },
          { label: "Surname", name: "surname", type: "text" },
          { label: "Password", name: "password", type: "password" },
          {
            label: "Repeat Password",
            name: "repeatPassword",
            type: "password",
          },
        ].map(({ label, name, type }) => (
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
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
