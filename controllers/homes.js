import { Home } from "../models/home.js";
import User from "../models/user.js";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAddHome = (_req, res, next) => {
  res.render("addhome", { title: "add the home" });
};
export const getLogin = (_req, res, next) => {
  res.render("auth/login", { title: "Login" });
};
export const getSignUp = (_req, res, next) => {
  res.render("auth/signUp", { title: "SignUp" });
};

export const postSignup = async (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.render("auth/signup", {
        error: "User already exists!",
        oldInput: req.body,
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userType,
    });

    await user.save();
    console.log("User saved in MongoDB:", user);

    res.redirect("/auth/login");
  } catch (err) {
    console.log("Error saving user:", err);
    res.status(500).send("Error saving user");
  }
};

export const postLogin = async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const password = req.body.password.trim();

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.render("auth/login", {
        error: "User not found! Please signup first.",
      });
    }

    const hashedInput = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (hashedInput !== user.password) {
      return res.render("auth/login", {
        error: "Wrong password! Email or password Doesn't Match",
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = user;

    console.log("Login Success:", user.email);
    return res.redirect("/");
  } catch (err) {
    console.log(err);
    res.render("auth/login", { error: "Something went wrong!" });
  }
};

export const postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

export const postAddHome = async (req, res, next) => {
  const { houseName, price, location } = req.body;
  const file = req.file ? req.file.path : "no-image.jpg"; // .filename ki jagah .path

  const home = new Home({ houseName, price, location, file });
  await home.save();

  res.render("homeadded", { title: "Home added successfully" });
};

export const getHomes = async (req, res, next) => {
  const registerHome = await Home.find();
  res.render("home", {
    registerHome: registerHome,
    title: "Homes List",
    isLoggedIn: req.isLoggedIn,
  });
};

export const getHomesDetails = async (req, res) => {
  const homeId = req.params.homeId;
  const home = await Home.findById(homeId);
  if (!home) {
    return res.status(404).render("404", { title: "Page Not Found" });
  }
  res.render("home-detail", { home: home, title: home.houseName });
};
