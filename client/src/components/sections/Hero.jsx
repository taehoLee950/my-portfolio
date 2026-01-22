import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './Hero.scss';

const Hero = () => {
  const { t } = useTranslation();

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

  return (
    <section id="hero" className="hero">
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
            <span className="hero__name">{t('hero.name')}</span>
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
          {/* 프로필 이미지 영역 - 추후 추가 */}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
