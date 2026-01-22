import React from 'react';
import Navbar from './components/common/Navbar';
import Hero from './components/sections/Hero';
import TechStack from './components/sections/TechStack';
import Projects from './components/sections/Projects';
import LearningCases from './components/sections/LearningCases';
import Contact from './components/sections/Contact';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <TechStack />
        <Projects />
        <LearningCases />
        <Contact />
      </main>
    </div>
  );
}

export default App;
