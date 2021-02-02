"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A08Server = void 0;
var Http = __importStar(require("http"));
var Mongo = __importStar(require("mongodb"));
var DB_NAME = 'Klausur';
var mongoClient = null;
var A08Server;
(function (A08Server) {
    console.log("Starting server");
    var port = Number(process.env.PORT);
    if (!port)
        port = 8100;
    mongoDbConnect();
    var server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(port);
    function mongoDbConnect() {
        return __awaiter(this, void 0, void 0, function () {
            var uri;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uri = "mongodb+srv://GISWISE2021:GISWISE2021@cluster0.qcexn.mongodb.net/Klausur?retryWrites=true&w=majority";
                        mongoClient = new Mongo.MongoClient(uri, { useNewUrlParser: true });
                        return [4 /*yield*/, mongoClient.connect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function handleListen() {
        console.log("Listening");
    }
    function login(request) {
        return __awaiter(this, void 0, void 0, function () {
            var psw, email, userArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!mongoClient) {
                            return [2 /*return*/, { error: true }];
                        }
                        psw = request.get('password');
                        email = request.get('email');
                        if (!psw || !email) {
                            return [2 /*return*/, { error: true }];
                        }
                        return [4 /*yield*/, mongoClient.db(DB_NAME).collection("admins").find({ email: email, password: psw }).toArray()];
                    case 1:
                        userArray = _a.sent();
                        if (userArray && userArray.length > 0) {
                            return [2 /*return*/, { error: false, email: email }];
                        }
                        return [2 /*return*/, { error: true }];
                }
            });
        });
    }
    function getItems() {
        return __awaiter(this, void 0, void 0, function () {
            var items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!mongoClient) {
                            return [2 /*return*/, { error: true }];
                        }
                        return [4 /*yield*/, mongoClient.db(DB_NAME).collection("items").find({}).toArray()];
                    case 1:
                        items = _a.sent();
                        return [2 /*return*/, { error: false, items: items }];
                }
            });
        });
    }
    function evaluateResponse(url, request) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, data, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(url);
                        response = {};
                        if (!url.startsWith('/Items')) return [3 /*break*/, 2];
                        return [4 /*yield*/, getItems()];
                    case 1:
                        response = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!url.startsWith('/Login')) return [3 /*break*/, 4];
                        data = new URLSearchParams(url.replace('/Login', ''));
                        return [4 /*yield*/, login(data)];
                    case 3:
                        response = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!url.startsWith('/ChangeItemStatus')) return [3 /*break*/, 6];
                        data = new URLSearchParams(url.replace('/ChangeItemStatus', ''));
                        return [4 /*yield*/, changeItemStatus(data)];
                    case 5:
                        response = _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!url.startsWith('/ReserveItem')) return [3 /*break*/, 8];
                        data = new URLSearchParams(url.replace('/ReserveItem', ''));
                        return [4 /*yield*/, reserveItem(data)];
                    case 7:
                        response = _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/, JSON.stringify(response)];
                }
            });
        });
    }
    function reserveItem(request) {
        return __awaiter(this, void 0, void 0, function () {
            var name, email, itemName, items, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!mongoClient) {
                            return [2 /*return*/, { error: true }];
                        }
                        name = request.get('name');
                        email = request.get('email');
                        itemName = request.get('itemName');
                        if (!name || !email || !itemName) {
                            return [2 /*return*/, { error: true }];
                        }
                        return [4 /*yield*/, mongoClient.db(DB_NAME).collection("items").find({ name: itemName }).toArray()];
                    case 1:
                        items = _a.sent();
                        if (!items || items.length === 0) {
                            return [2 /*return*/, { error: true }];
                        }
                        item = items[0];
                        if (item.status !== 'frei') {
                            return [2 /*return*/, { error: true }];
                        }
                        item.status = 'reserviert';
                        item.owner = name + ', ' + email;
                        return [4 /*yield*/, mongoClient.db(DB_NAME).collection("items").updateOne({ name: item.name }, { $set: __assign({}, item) })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { error: false }];
                }
            });
        });
    }
    function changeItemStatus(request) {
        return __awaiter(this, void 0, void 0, function () {
            var itemName, items, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!mongoClient) {
                            return [2 /*return*/, { error: true }];
                        }
                        itemName = request.get('itemName');
                        if (!itemName) {
                            return [2 /*return*/, { error: true }];
                        }
                        return [4 /*yield*/, mongoClient.db(DB_NAME).collection("items").find({ name: itemName }).toArray()];
                    case 1:
                        items = _a.sent();
                        if (!items || items.length === 0) {
                            return [2 /*return*/, { error: true }];
                        }
                        item = items[0];
                        if (item.status === 'frei') {
                            return [2 /*return*/, { error: true }];
                        }
                        if (item.status === 'reserviert') {
                            item.status = 'ausgeliehen';
                        }
                        else if (item.status === 'ausgeliehen') {
                            item.owner = '';
                            item.status = 'frei';
                        }
                        else {
                            return [2 /*return*/, { error: true }];
                        }
                        return [4 /*yield*/, mongoClient.db(DB_NAME).collection("items").updateOne({ name: item.name }, { $set: __assign({}, item) })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { error: false }];
                }
            });
        });
    }
    function handleRequest(_request, _response) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("I hear voices!", _request.url);
                        return [4 /*yield*/, evaluateResponse(_request.url, _request)];
                    case 1:
                        response = _a.sent();
                        _response.setHeader("content-type", "text/html; charset=utf-8");
                        _response.setHeader("Access-Control-Allow-Origin", "*");
                        _response.write(response);
                        _response.end();
                        return [2 /*return*/];
                }
            });
        });
    }
})(A08Server = exports.A08Server || (exports.A08Server = {}));
// //Collection: users
// Felder:
// {
//   email: string;
//   password: string;
// }
// //Collection: items
// Felder:
// {
//   name: string;
//   pic: string;
//   status: string;
//   beschreibung: string;
//   owner: string;
// }
