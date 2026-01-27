import { createPortal } from 'react-dom';

/**
 * Portal 컴포넌트
 * 모달 등을 body에 직접 렌더링하여 z-index 스택 컨텍스트 문제를 해결
 */
const Portal = ({ children }) => {
  // 서버 사이드 렌더링 대응
  if (typeof document === 'undefined') {
    return null;
  }
  
  return createPortal(children, document.body);
};

export default Portal;
