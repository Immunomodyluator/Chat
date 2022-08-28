import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();
const app = express();
app.use(express.json());

router.post("/register", (req, res) => {
  let { login, password, email } = req.body;
  userController
    .registration(login, password, email)
    .then((saveUser) => {
      console.log(saveUser.login);
      res.cookie("login", saveUser.login);
      return res.status(201).send(saveUser.login);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

router.post("/login", (req, res) => {
  let { login, password, email } = req.body;
  userController
    .login(login, password, email)
    .then((login) => {
      console.log(login);
      res.cookie("login", login.login);
      return res.status(201).send(login);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(400).send(error.message);
    });
});

router.get("/logout", (req, res) => {
  res.clearCookie("login");
  res.end();
});

router.get("/cookie", (req, res) => {
  res.send(req.cookies.login);
});

export default router;
