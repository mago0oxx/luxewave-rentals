import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Pricing from './components/Pricing';
import Gallery from './components/Gallery';
import ReservationForm from './components/ReservationForm';
import Footer from './components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';


function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);
  return (
    <div className="w-full font-sans">
      <Navbar />
      <Hero />
      <Pricing />
      <Gallery />
      <ReservationForm />
      <Footer />
    </div>
  );
}

export default App;
