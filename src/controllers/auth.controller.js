import authService from "../services/auth.service.js";

const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const token = await authService.loginService({ email, password });
        return res.send(token);
    } catch (e) {
        return res.status(401).send(e.message);
    }
};

const refreshTokenController = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        const newToken = await authService.refreshTokenService(refreshToken);
        return res.send({ token: newToken });
    } catch (e) {
        return res.status(401).send(e.message);
    }
};

const logoutController = async (req, res) => {
    const { token } = req.body;

    try {
        await authService.logoutService(token);
        return res.send({ message: "Logout successful" });
    } catch (e) {
        return res.status(400).send(e.message);
    }
};

export default {
    loginController,
    refreshTokenController,
    logoutController
};