import HeroSection from "../components/HeroSection";
import RegisterForm from "../components/RegisterSection";
import StepsSection from "../components/StepsSection";

function MainPage() {
  return (
    <div className="font-sans">
      <HeroSection />
      <StepsSection />
      <RegisterForm />
    </div>
  );
}

export default MainPage;
