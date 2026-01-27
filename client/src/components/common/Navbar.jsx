import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import './Navbar.scss';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { key: 'home', to: 'hero', label: t('nav.home') },
    { key: 'techStack', to: 'tech-stack', label: t('nav.techStack') },
    { key: 'projects', to: 'projects', label: t('nav.projects') },
    { key: 'learning', to: 'learning', label: t('nav.learning') },
    { key: 'contact', to: 'contact', label: t('nav.contact') },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <div className="navbar__logo">
          <ScrollLink to="hero" smooth={true} duration={500}>
            Portfolio
          </ScrollLink>
        </div>
        <ul className={`navbar__menu ${isMenuOpen ? 'navbar__menu--open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.key} className="navbar__item">
              <ScrollLink
                to={item.to}
                smooth={true}
                duration={500}
                offset={-80}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </ScrollLink>
            </li>
          ))}
          <li className="navbar__item">
            <button
              className="navbar__lang-toggle"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              {i18n.language === 'ko' ? 'EN' : 'KO'}
            </button>
          </li>
          {/* Admin Navigation */}
          {isAuthenticated && (
            <>
              <li className="navbar__item navbar__item--admin">
                <RouterLink 
                  to="/admin/inquiries" 
                  className="navbar__admin-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  [INQUIRIES]
                </RouterLink>
              </li>
              <li className="navbar__item navbar__item--admin">
                <button
                  className="navbar__logout-btn"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  [LOGOUT]
                </button>
              </li>
            </>
          )}
        </ul>
        <button
          className="navbar__toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
