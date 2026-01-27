import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Github, FileText, Terminal as TerminalIcon } from 'lucide-react';
import profilePicture from '../../assets/images/profilePicture.png';
import './Hero.scss';

const Hero = () => {
  const { t } = useTranslation();
  const [isGlitching, setIsGlitching] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section id="hero" className="hero">
      {/* 배경 장식: 스캔라인 및 노이즈 */}
      <div className="hero__scanline" />
      <div className="hero__noise" />

      <div className="hero__container">
        <motion.div 
          className="hero__content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 시스템 부트 배지 */}
          <motion.div className="hero__badge" variants={itemVariants}>
            <TerminalIcon size={14} />
            <span>SYSTEM_STATUS: ONLINE</span>
          </motion.div>

          <motion.h1 className="hero__title" variants={itemVariants}>
            <span className="hero__title-top">{t('hero.title')}</span>
            <br />
            <span
              className={`hero__name ${isGlitching ? 'hero__name--glitch' : ''}`}
              onMouseEnter={() => { setIsGlitching(true); setTimeout(() => setIsGlitching(false), 300); }}
              data-text={t('hero.name')}
            >
              {t('hero.name')}
            </span>
            <span className="hero__title-sub">{t('hero.subtitle')}</span>
          </motion.h1>

          {/* 터미널 스타일 정보 섹션 */}
          <motion.div className="hero__terminal" variants={itemVariants}>
            <div className="hero__terminal-row">
              <span className="label">> STATUS:</span>
              <span className="value status-active">{t('hero.status') || 'ACTIVE_READY'}</span>
            </div>
            <div className="hero__terminal-row">
              <span className="label">> FOCUS:</span>
              <span className="value">{t('hero.focus') || 'Full-stack_Architecture'}</span>
            </div>
          </motion.div>

          {/* 하단 링크 버튼 그룹 - 태호님 실제 링크 반영 */}
          <motion.div className="hero__actions" variants={itemVariants}>
            <a 
              href="https://github.com/taehoLee950" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hero__btn hero__btn--primary"
            >
              <Github size={18} /> <span>[ GITHUB_ME ]</span>
            </a>
            <a 
              href="https://www.notion.so/2ed3ee00e67a80af9479f42717b770d4" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hero__btn"
            >
              <FileText size={18} /> <span>[ NOTION_CV ]</span>
            </a>
          </motion.div>
        </motion.div>

        {/* 오른쪽 이미지 섹션 (데이터 스캐닝 효과 추가) */}
        <motion.div 
          className="hero__image-section"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="hero__image-frame">
            <div className="hero__image-glitch" />
            <img src={profilePicture} alt="Taeho Lee" className="hero__profile-img" />
            {/* 이미지 위를 지나가는 스캔 레이저 */}
            <div className="hero__image-scanner" />
          </div>
          {/* 이미지 주변 장식 요소 */}
          <div className="hero__image-decoration deco-tl">+</div>
          <div className="hero__image-decoration deco-br">+</div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;