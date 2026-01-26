import axiosInstance from '../axiosInstance';

const authService = {
  /**
   * 관리자 로그인을 요청합니다.
   * @param {string} adminId - 관리자 ID
   * @param {string} password - 비밀번호
   * @returns {Promise<AxiosResponse<any>>}
   */
  login: (adminId, password) => {
    return axiosInstance.post('/auth/login', { adminId, password });
  },
};

export default authService;
