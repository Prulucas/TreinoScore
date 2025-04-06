import authService from "../services/auth.service.js";

const loginController = async (req, res) => {
    console.log("Request Body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const result = await authService.loginService(email, password);
        return res.json(result);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};


export default { loginController };
