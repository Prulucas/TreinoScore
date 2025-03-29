import User from "../models/User.js";

const loginRepository = (email) =>
    User.findOne({ where: { email } });

export default { loginRepository };