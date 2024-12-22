export default function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 text-center">
      <h1 className="text-5xl font-extrabold mb-6">ControlaMaterial</h1>
      <p className="text-lg mb-8">
        L'aplicacio que ajuda als centres educatius a gestionar el seu iventari.
      </p>
      <a
        href="#register"
        className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100"
      >
        Comenca ara mateix
      </a>
    </div>
  );
}

