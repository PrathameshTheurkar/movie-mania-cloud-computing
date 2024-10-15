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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../db/db");
const user_1 = require("../middleware/user");
const zod_1 = require("zod");
const router = express_1.default.Router();
const newUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(2).max(50),
    password: zod_1.z.string().min(6).max(20),
    firstName: zod_1.z.string().min(2).max(20),
    lastName: zod_1.z.string().min(2).max(20)
});
const userSchema = zod_1.z.object({
    username: zod_1.z.string().min(2).max(50),
    password: zod_1.z.string().min(6).max(20),
});
// Zod inference
// type userSchemaType = z.infer<typeof userSchema>
// User routes
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to sign up user
    const parsedInput = newUserSchema.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(411).json({
            msg: parsedInput.error
        });
    }
    let { username, password, firstName, lastName } = parsedInput.data;
    const existingUser = yield db_1.User.findOne({ username, password });
    if (existingUser) {
        res.json({ success: false, message: "User already signed up" });
    }
    else {
        const newUser = new db_1.User({
            firstName,
            lastName,
            username,
            password,
            purchasedMovies: [],
        });
        yield newUser.save();
        const token = (0, user_1.generateTokenUser)(req.body);
        // res.status(200).cookie("token", token, {expire : 24 * 60 * 60 * 1000}).json({message : "User created successfully" , token})
        res
            .status(200)
            .json({ success: true, message: "User created successfully", token });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to log in user
    const parsedInput = userSchema.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(411).json({
            msg: parsedInput.error
        });
    }
    const { username, password } = parsedInput.data;
    const user1 = yield db_1.User.findOne({ username, password });
    if (user1) {
        const token = (0, user_1.generateTokenUser)(user1);
        // res.cookie("token", token, {expire : 24 * 60 * 60 * 1000}).json({message : "Login Succesfully" , token1 : token})
        res
            .status(200)
            .json({ success: true, message: "Login Succesfully", token });
    }
    else {
        res.json({ success: false, message: "User not found" });
    }
}));
router.get("/me", user_1.authenticateJWTUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        success: true,
        user: req.headers.user,
        auth: true,
    });
}));
router.get("/movies", user_1.authenticateJWTUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to list all movies
    const movies = yield db_1.Movie.find();
    res.json({ success: true, movies: movies });
}));
router.get("/movie/:movieId", user_1.authenticateJWTUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //logic to get a single movie
    const movieId = req.params.movieId;
    const movie = yield db_1.Movie.findById(movieId);
    if (movie) {
        res.status(200).json({ success: true, msg: "Movie founded", movie });
    }
    else {
        res.status(404).json({ success: false, msg: "Movie not found" });
    }
}));
router.post("/movies/:movieId", user_1.authenticateJWTUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to purchase a movie
    const isValid = mongoose_1.default.Types.ObjectId.isValid(req.params.movieId);
    if (!isValid) {
        return res
            .status(403)
            .json({ success: false, message: "Invalid movieId" });
    }
    const movie = yield db_1.Movie.findById(req.params.movieId);
    if (movie) {
        const user = yield db_1.User.findOne({ username: req.headers.user });
        if (user) {
            const isPurchased = user.purchasedMovies.find((co) => co._id.toString() == req.params.movieId);
            if (isPurchased) {
                res.json({ success: true, message: "Movie already purchased" });
            }
            else {
                user.purchasedMovies.push(movie._id);
                yield user.save();
                res.json({ success: true, message: "Movie purchased" });
            }
        }
        else {
            res.status(403).json({ success: false, message: "User doesn't exist" });
        }
    }
    else {
        res.status(404).json({ success: false, message: "Movie doesn't exist" });
    }
}));
router.get("/purchasedMovies", user_1.authenticateJWTUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to view purchased movies
    const user = yield db_1.User.findOne({ username: req.headers.user }).populate("purchasedMovies");
    if (user) {
        res.json({ success: true, purchasedMovies: user.purchasedMovies || [] });
    }
    else {
        res.status(403).json({ success: false, message: "User not found" });
    }
}));
exports.default = router;
