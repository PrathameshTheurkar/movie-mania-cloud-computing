"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWTAdmin = exports.generateTokenAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// interface AuthenticatedRequest extends Request {
//   user?: string | jwt.JwtPayload | undefined | User
// }
const generateTokenAdmin = (user) => {
    const secretKeyAdmin = 'superSc3r3t1';
    if (!secretKeyAdmin) {
        throw new Error('Secret key not found');
    }
    const payload = { username: user.username };
    return jsonwebtoken_1.default.sign(payload, secretKeyAdmin, { expiresIn: '1h' });
};
exports.generateTokenAdmin = generateTokenAdmin;
const authenticateJWTAdmin = (req, res, next) => {
    const secretKeyAdmin = 'superSc3r3t1';
    if (!secretKeyAdmin) {
        throw new Error('Secret key not found');
    }
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        // const token  = req.cookies.token
        jsonwebtoken_1.default.verify(token, secretKeyAdmin, (err, user) => {
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
exports.authenticateJWTAdmin = authenticateJWTAdmin;
