const rateLimit = require('express-rate-limit');

// 일반 API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100회 요청
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// 문의하기 API 엄격한 제한 (1분당 1회)
const inquiryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1분
  max: 1, // 최대 1회
  message: 'Too many inquiry requests. Please wait a minute before trying again.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// 로그인 API 제한 (5회 실패 시 30분 차단)
const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30분
  max: 5, // 최대 5회
  message: 'Too many login attempts. Please try again after 30 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // 성공한 요청은 카운트하지 않음
});

module.exports = {
  apiLimiter,
  inquiryLimiter,
  loginLimiter,
};
