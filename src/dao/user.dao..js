import UserModel from "../models/User.js";

class UserDAO {
  async create(user) {
    return await UserModel.create(user);
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async findById(id) {
    return await UserModel.findById(id);
  }
}

export default new UserDAO();
