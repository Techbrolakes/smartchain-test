// src/index.ts
import express from "express";
import { ensureConnection } from "./utils/db";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("./schema/userSchema");

const app = express();
const port = 5700;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.post("/register", async (req: any, res: any) => {
  try {
    const { firstName, lastName, email, password, country } = req.body;

    if (!firstName) {
      return res.status(400).send({ error: "First name is required" });
    }
    if (!lastName) {
      return res.status(400).send({ error: "Last name is required" });
    }
    if (!email) {
      return res.status(400).send({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).send({ error: "Password is required" });
    }
    if (!country) {
      return res.status(400).send({ error: "Country is required" });
    }

    const existingUser = await UserModel.findOne({
      email,
    });

    if (existingUser) {
      return res
        .status(400)
        .send({ error: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      country,
    });
    await user.save();

    res.status(201).send({
      data: user,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(400);
  }
});

app.post("/login", async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).send({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      "secret",
      {
        expiresIn: "24h",
      }
    );

    res.send({
      token,
      data: user,
      message: "Logged in successfully",
    });
  } catch (error) {
    res.status(400);
  }
});

app.post("/logout", (req: any, res: any) => {
  try {
    const { email } = req.body;

    const user = UserModel.findOne({ email });

    // invalidate token
    jwt.sign(
      {
        id: user._id,
      },
      "secret",
      {
        expiresIn: "0",
      }
    );
    res.send({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400);
  }
});

ensureConnection()
  .then(async (db: any) => {})
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
