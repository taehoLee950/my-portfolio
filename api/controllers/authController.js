import asyncHandler from "../utils/asyncHandler.js";
import authService from "../services/authService.js";

const authController = {
  login: asyncHandler(async (req, res, next) => {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Admin ID and password are required",
      });
    }

    const { accessToken, refreshToken, admin } = await authService.login(
      adminId,
      password,
    );

    // 쿠키 설정: httpOnly로 자바스크립트 접근 차단 (XSS 방지)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      status: "success",
      data: {
        accessToken, // AccessToken은 클라이언트 State 관리용
        admin,
      },
    });
  }),

  refresh: asyncHandler(async (req, res, next) => {
    // 바디가 아닌 쿠키에서 refreshToken을 가져옴
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        status: "fail",
        message: "Refresh token not found in cookies",
      });
    }

    const { accessToken } = await authService.refreshToken(refreshToken);

    res.status(200).json({
      status: "success",
      data: { accessToken },
    });
  }),

  logout: asyncHandler(async (req, res, next) => {
    res.clearCookie("refreshToken");
    res.status(200).json({ status: "success", message: "Logged out" });
  }),

  savePushSubscription: asyncHandler(async (req, res, next) => {
    const { subscription } = req.body;
    const adminId = req.admin.adminId;

    if (!subscription) {
      return res.status(400).json({
        status: "fail",
        message: "Push subscription is required",
      });
    }

    const result = await authService.savePushSubscription(
      adminId,
      subscription,
    );

    res.status(200).json({
      status: "success",
      data: result,
    });
  }),
};

export default authController;
