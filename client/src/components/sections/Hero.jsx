import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import profilePicture from '../../assets/images/profilePicture.png'; // Import the profile picture
import './Hero.scss';

const Hero = () => {
  const { t } = useTranslation();
  const [isGlitching, setIsGlitching] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const handleNameHover = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 500);
  };

  // 바이너리 코드 장식 데이터
  const binaryData = [
    '01001000 01100101 01101100 01101100 01101111',
    '01010111 01101111 01110010 01101100 01100100',
    '00110001 00110000 00110001 00110000 00110001',
    '01000011 01111001 01100010 01100101 01110010',
  ];

  return (
    <section id="hero" className="hero">
      {/* 배경 장식 데이터 */}
      <div className="hero__binary-bg">
        {binaryData.map((data, index) => (
          <div
            key={index}
            className="hero__binary-item"
            style={{
              top: `${20 + index * 15}%`,
              left: `${10 + index * 5}%`,
              opacity: 0.1,
            }}
          >
            {data}
          </div>
        ))}
      </div>

      <div className="hero__container">
        <motion.div
          className="hero__content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="hero__title" variants={itemVariants}>
            {t('hero.title')}
            <br />
            <span
              className={`hero__name ${isGlitching ? 'hero__name--glitch' : ''}`}
              onMouseEnter={handleNameHover}
              data-text={t('hero.name')}
            >
              {t('hero.name')}
            </span>
            {t('hero.subtitle')}
          </motion.h1>
          <motion.p className="hero__subtitle" variants={itemVariants}>
            {/* 추후 추가 예정 */}
          </motion.p>
        </motion.div>
        <motion.div
          className="hero__image"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="hero__image-frame">
            {/* 프로필 이미지 영역 */}
            <img src={profilePicture} alt="Profile" className="hero__profile-picture" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
