"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWTUser = exports.generateTokenUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateTokenUser = (user) => {
    const secretKeyUser = process.env.SECRET_KEY_USER;
    if (!secretKeyUser) {
        throw new Error('Secret key not found');
    }
    const payload = { username: user.username };
    return jsonwebtoken_1.default.sign(payload, secretKeyUser, { expiresIn: '1h' });
};
exports.generateTokenUser = generateTokenUser;
const authenticateJWTUser = (req, res, next) => {
    const secretKeyUser = process.env.SECRET_KEY_USER;
    if (!secretKeyUser) {
        throw new Error('Secret key not found');
    }
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        // const token = req.cookies.token
        jsonwebtoken_1.default.verify(token, secretKeyUser, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (!user) {
                return res.sendStatus(403);
            }
            if (typeof user === 'string') {
                return res.sendStatus(403);
            }
            req.headers['user'] = user.username;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticateJWTUser = authenticateJWTUser;
