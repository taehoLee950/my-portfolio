import React from 'react';
import Navbar from './components/common/Navbar';
import Hero from './components/sections/Hero';
import TechStack from './components/sections/TechStack';
import Projects from './components/sections/Projects';
import LearningCases from './components/sections/LearningCases';
import Contact from './components/sections/Contact';
import WireFlow from './components/common/WireFlow';

function App() {
  // Wire Flow 경로 정의 (화면 전체를 가로지르는 전기 흐름 경로)
  const wirePaths = [
    'M 0,100 Q 250,50 500,100 T 1000,100',
    'M 0,300 Q 250,250 500,300 T 1000,300',
    'M 0,500 Q 250,450 500,500 T 1000,500',
    'M 0,700 Q 250,650 500,700 T 1000,700',
  ];

  return (
    <div className="app">
      <WireFlow paths={wirePaths} />
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
