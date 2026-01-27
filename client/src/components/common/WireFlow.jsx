import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './WireFlow.scss';

const WireFlow = ({ paths = [] }) => {
  const [activePath, setActivePath] = useState(null);
  const [sparkPosition, setSparkPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomDelay = Math.random() * 4000 + 3000; // 3-7초 사이
      setTimeout(() => {
        const randomPath = Math.floor(Math.random() * paths.length);
        setActivePath(randomPath);
        setSparkPosition(0);

        // 스파크 애니메이션
        const animationDuration = 2000;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / animationDuration, 1);
          setSparkPosition(progress * 100);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setActivePath(null);
          }
        };

        animate();

        // 사운드 효과 (선택사항)
        if (typeof AudioContext !== 'undefined') {
          const audioContext = new AudioContext();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = 200;
          oscillator.type = 'sawtooth';

          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

          oscillator.start();
          oscillator.stop(audioContext.currentTime + 0.1);
        }
      }, randomDelay);
    }, 10000); // 10초마다 체크

    return () => clearInterval(interval);
  }, [paths.length]);

  if (!paths.length) return null;

  return (
    <div className="wire-flow">
      <svg className="wire-flow__svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={activePath !== null ? '#00f3ff' : 'transparent'} />
            <stop offset="100%" stopColor={activePath !== null ? '#ff00ff' : 'transparent'} />
          </linearGradient>
        </defs>

        {paths.map((path, index) => (
          <g key={index}>
            {/* 기본 와이어 */}
            <path
              d={path}
              fill="none"
              stroke="rgba(0, 243, 255, 0.2)"
              strokeWidth="2"
              className="wire-flow__path"
            />

            {/* 활성화된 전기 흐름 */}
            {activePath === index && (
              <motion.path
                d={path}
                fill="none"
                stroke="url(#sparkGradient)"
                strokeWidth="3"
                strokeDasharray="10 5"
                initial={{ strokeDashoffset: 1000 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, ease: 'linear' }}
                filter="url(#glow)"
                className="wire-flow__active"
              />
            )}

            {/* 스파크 포인트 - path를 따라 이동하는 효과는 CSS로 구현 */}
            {activePath === index && (
              <motion.circle
                r="8"
                fill="#00f3ff"
                filter="url(#glow)"
                className="wire-flow__spark"
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default WireFlow;
