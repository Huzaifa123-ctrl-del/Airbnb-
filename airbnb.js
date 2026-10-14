import express from "express";
import { hostRouter } from "./routes/hostRouter.js";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import { error } from "./controllers/errors.js";
import { mongoConnect } from "./utils/database.js";
import session from "express-session";
import MongoStore from "connect-mongo";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- SESSION FIX FOR VERCEL ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "Huzaifa",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 din
      httpOnly: true,
      secure: false, 
    },
  })
);

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(userRouter);
app.use(authRouter);
app.use(
  "/host",
  (req, res, next) => {
    if (!req.isLoggedIn) {
      return res.redirect("/auth/login");
    }
    next();
  },
  hostRouter
);

app.use(error);
const PORT = 3000;

export default app;

if (process.env.NODE_ENV !== 'production') {
  mongoConnect(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
} else {
  mongoConnect(() => {
    console.log("MongoDB connected on Vercel");
  });
}