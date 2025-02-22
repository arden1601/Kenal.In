import './App.css'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import InfoSection from './components/Information.jsx'
import InfoImage from './assets/logoweb.jpg'
import ClientStats from './components/Clientinfo.jsx'
import FeaturesSection from './components/Feature.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <InfoSection 
        image={InfoImage}
        title="Aku adalah ANIMEEEE"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio."
        buttonText="Learn More BROOOOOOOOO"
      />
    <ClientStats />
    <FeaturesSection />
    <Footer />
    </>
  )
}

export default App