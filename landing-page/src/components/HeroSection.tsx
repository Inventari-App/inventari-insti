export default function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 text-center">
      <h1 className="text-5xl font-extrabold mb-6">Welcome to Our App!</h1>
      <p className="text-lg mb-8">
        Transform your experience with the best tools for success.
      </p>
      <a
        href="#register"
        className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100"
      >
        Get Started
      </a>
    </div>
  );
}

