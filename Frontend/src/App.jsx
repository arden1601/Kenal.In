import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import InfoSection from "./components/Information.jsx";
import InfoImage from "./assets/logoweb.jpg";
import ClientStats from "./components/Clientinfo.jsx";
import FeaturesSection from "./components/Feature.jsx";
import Footer from "./components/Footer.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  return (
    <Router>
      <div className="relative">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="relative">
                  <section id="home">
                    <Hero />
                  </section>
                  <section id="information">
                    <InfoSection
                      image={InfoImage}
                      title="Aku adalah ANIMEEEE"
                      description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio."
                      buttonText="Learn More BROOOOOOOOO"
                    />
                  </section>
                  <section id="community">
                    <ClientStats />
                  </section>
                  <section id="feature">
                    <FeaturesSection />
                  </section>
                  <section id="pricing">
                    {/* Add your pricing section content here */}
                    <div className="py-20 bg-gray-50">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-[#573C27] mb-8">
                          Our Pricing Plans
                        </h2>
                        <p className="text-[#A98360] mb-10 max-w-2xl mx-auto">
                          Choose the right plan for your needs
                        </p>
                        {/* Your pricing content would go here */}
                      </div>
                    </div>
                  </section>
                </main>
                <Footer />
              </>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
