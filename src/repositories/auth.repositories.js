import User from "../models/User.js";

const loginRepository = (email) => User.findOne({ email }).select("+password");
const findById = (id) => User.findById(id);

export default { loginRepository, findById };