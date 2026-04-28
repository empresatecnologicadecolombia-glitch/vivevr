import Navbar from "@/components/Navbar";
import EducationSection from "@/components/EducationSection";

const EducacionPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <EducationSection />
      </div>
    </div>
  );
};

export default EducacionPage;
