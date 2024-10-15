"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
dotenv_1.default.config({
    path: path_1.default.join(__dirname, '../.env')
});
app.use(express_1.default.json());
const buildPath = path_1.default.join(__dirname, '../../admin/dist');
app.use(express_1.default.static(buildPath));
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use('/admin', admin_1.default);
app.use('/users', user_1.default);
// Connect to MongoDB
mongoose_1.default.connect(('mongodb+srv://prathameshtheurkar037:Prathamesh%401@cluster0.s8asa1j.mongodb.net/'), { dbName: 'movie-mania' });
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../admin/dist', 'index.html'), (err) => {
        if (err)
            res.status(500).send(err);
    });
});
app.listen(4000, () => {
    console.log('Server is listening on port 3000');
});
