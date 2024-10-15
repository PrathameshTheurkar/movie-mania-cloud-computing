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
const admin_1 = require("../middleware/admin");
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
// Admin routes
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to sign up admin
    const parsedInput = newUserSchema.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(411).json({
            msg: parsedInput.error
        });
    }
    const { username, password, firstName, lastName } = parsedInput.data;
    const admin = yield db_1.Admin.findOne({ username, password });
    if (admin) {
        res.status(403).json({ success: false, massage: 'Admin already exits' });
    }
    else {
        const newAdmin = new db_1.Admin({ firstName, lastName, username, password });
        yield newAdmin.save();
        const token = (0, admin_1.generateTokenAdmin)(req.body);
        res.json({ success: true, message: 'Admin created successfully', token: token });
        //   res.cookie("token", token, {expire : 24 * 60 * 60 * 1000 }).json({ success : true,message: 'Admin created successfully'  , token1 : token});
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to log in admin
    const parsedInput = userSchema.safeParse(req.body);
    if (!parsedInput.success) {
        return res.status(411).json({
            msg: parsedInput.error
        });
    }
    const { username, password } = parsedInput.data;
    const admin = yield db_1.Admin.findOne({ username, password });
    if (admin) {
        const token = (0, admin_1.generateTokenAdmin)(admin);
        res.json({ success: true, message: 'Login Successfully', token1: token });
        //   res.cookie("token", token, {expire : 24 * 60 * 60 * 1000 }).json({success : true, message : 'Login Successfully' , token1 : token})
    }
    else {
        res.json({ success: false, message: 'Admin Authentication failed' });
    }
}));
router.get('/me', admin_1.authenticateJWTAdmin, (req, res) => {
    res.json({
        auth: true,
        user: req.headers.user
    });
});
router.post('/movies', admin_1.authenticateJWTAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to create a movie
    let movie = req.body;
    const newMovie = new db_1.Movie(movie);
    const checkMovieExist = yield db_1.Movie.findOne({ title: newMovie.title, description: newMovie.description, price: newMovie.price, imageLink: newMovie.imageLink, published: newMovie.published });
    if (checkMovieExist) {
        res.json({ success: false, message: "Movie already created" });
    }
    else {
        yield newMovie.save();
        res.json({ success: true, message: "Movie created successfully", movieId: newMovie._id.toString() });
    }
    // }
}));
router.put('/movie/:movieId', admin_1.authenticateJWTAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to update a movie
    const isValid = mongoose_1.default.Types.ObjectId.isValid(req.params.movieId);
    if (!isValid) {
        return res.status(403).json({ success: false, message: "Invalid movieId" });
    }
    const movie = yield db_1.Movie.findByIdAndUpdate(req.params.movieId, req.body, { new: true });
    if (movie) {
        res.json({ success: true, message: "Movie Updated Successfully" });
    }
    else {
        res.status(403).json({ success: false, message: "Movie doesn't exits" });
    }
}));
router.get('/movie/:movieId', admin_1.authenticateJWTAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to get one movie by movieId
    const isValid = mongoose_1.default.Types.ObjectId.isValid(req.params.movieId);
    if (!isValid) {
        return res.status(403).json({ success: false, message: "Invalid movieId" });
    }
    const movie = yield db_1.Movie.findById(req.params.movieId);
    if (movie) {
        res.status(200).json({ success: true, message: "Movie fetched successfully", movie });
    }
    else {
        res.status(403).json({ success: false, message: "Movie doesn't exits!!" });
    }
}));
router.get('/movies', admin_1.authenticateJWTAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // logic to get all movies
    const movies = yield db_1.Movie.find({});
    res.json(movies);
}));
router.delete('/movie/:movieId', admin_1.authenticateJWTAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movieId } = req.params;
    const movieExist = yield db_1.Movie.findById(movieId);
    if (movieExist) {
        const movie = yield db_1.Movie.findByIdAndDelete(movieId);
        res.status(200).json({ success: true, msg: 'Movie Deleted Successfully', movie });
    }
    else {
        res.json({ success: false, msg: 'Movie does not exist' });
    }
}));
exports.default = router;
