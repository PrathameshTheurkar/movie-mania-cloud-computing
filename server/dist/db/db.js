"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = exports.Admin = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Define mongoose Schema 
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    purchasedMovies: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Movie' }]
});
const adminSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const movieSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean
});
// Define mongoose models
exports.User = mongoose_1.default.model('User', userSchema);
exports.Admin = mongoose_1.default.model('Admin', adminSchema);
exports.Movie = mongoose_1.default.model('Movie', movieSchema);
