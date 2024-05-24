"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const db_1 = require("./utils/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("./schema/userSchema");
const app = (0, express_1.default)();
const port = 5700;
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Express!");
});
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingUser = yield UserModel.findOne({
            email,
        });
        if (existingUser) {
            return res
                .status(400)
                .send({ error: "User with this email already exists" });
        }
        const hashedPassword = yield bcrypt.hash(req.body.password, 10);
        const user = new UserModel({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            country,
        });
        yield user.save();
        res.status(201).send({
            data: user,
            message: "User registered successfully",
        });
    }
    catch (error) {
        res.status(400);
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield UserModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: "Invalid email or password" });
        }
        const isPasswordValid = yield bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ error: "Invalid email or password" });
        }
        const token = jwt.sign({
            id: user._id,
        }, "secret", {
            expiresIn: "24h",
        });
        res.send({
            token,
            data: user,
            message: "Logged in successfully",
        });
    }
    catch (error) {
        res.status(400);
    }
}));
app.post("/logout", (req, res) => {
    try {
        const { email } = req.body;
        const user = UserModel.findOne({ email });
        // invalidate token
        jwt.sign({
            id: user._id,
        }, "secret", {
            expiresIn: "0",
        });
        res.send({ message: "Logged out successfully" });
    }
    catch (error) {
        res.status(400);
    }
});
(0, db_1.ensureConnection)()
    .then((db) => __awaiter(void 0, void 0, void 0, function* () { }))
    .catch((err) => console.log(err));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
