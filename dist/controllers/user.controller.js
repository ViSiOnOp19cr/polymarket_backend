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
exports.SignIn = exports.SignUp = void 0;
const db_1 = require("../lib/db");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const validation = zod_1.z.object({
    username: zod_1.z.string()
        .min(3, "username must be min 3 letters")
        .max(30, "username must be max 30 letters"),
    password: zod_1.z.string()
        .min(8, "password must be min 8 letters")
        .max(30, "password must be max 30 letters")
});
const SignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validateSignup = validation.safeParse(req.body);
        if (!validateSignup.success) {
            return res.status(400).json({
                message: "Invalid input"
            });
        }
        const { username, password } = validateSignup.data;
        const salt = 12;
        const hash = yield bcrypt_1.default.hash(password, salt);
        const user = yield db_1.prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (user) {
            return res.status(400).json({ error: "user already exists" });
        }
        const newuser = yield db_1.prisma.user.create({
            data: {
                username: username,
                password: hash
            }
        });
        return res.status(201).json({ message: "user created successfully" });
    }
    catch (e) {
        console.error('SignUp error:', e);
        return res.status(500).json({ message: "something is fishy try again later." });
    }
});
exports.SignUp = SignUp;
const SignIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Loginvalidation = validation.safeParse(req.body);
        if (!Loginvalidation.success) {
            return res.status(400).json({
                message: "invalid input form"
            });
        }
        const { username, password } = Loginvalidation.data;
        const user = yield db_1.prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (!user) {
            return res.status(400).json({
                message: "username doesn't exist"
            });
        }
        const hashedpassword = yield bcrypt_1.default.compare(password, user.password);
        if (!hashedpassword) {
            return res.status(400).json({
                message: "invalid password"
            });
        }
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET);
        return res.status(200).json({
            message: "logged in successfully",
            token: token
        });
    }
    catch (error) {
        console.error('SignIn error:', error);
        return res.status(500).json({
            message: "something seems to be fishy"
        });
    }
});
exports.SignIn = SignIn;
