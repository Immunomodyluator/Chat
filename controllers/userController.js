import User from "../models/user.js";

class userController {
  static async registration(login, password, email) {
    try {
      let user = new User({
        login: login,
        password: password,
        email: email,
      });
      await user.setPassword(password);
      return await user.save();
    } catch (error) {
      throw new Error(error);
    }
  }

  static async login(login, password, email) {
    try {
      return User.findOne({ email: email }).then((user) => {
        console.log(user);
        if (user === null) {
          throw new Error("Пользователь не найден");
        } else {
          if (user.validPassword(password)) {
            return user;
          } else {
            throw new Error("Wrong password");
          }
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default userController;
