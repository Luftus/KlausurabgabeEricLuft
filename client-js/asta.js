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
function startAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var loggedIn, itemRequest, itemResponse, itemListDiv, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loggedIn = localStorage.getItem('loggedIn');
                    if (!loggedIn) {
                        window.location.assign('../LoginAdmin.html');
                    }
                    return [4 /*yield*/, fetch(main_url + '/Items')];
                case 1:
                    itemRequest = _a.sent();
                    return [4 /*yield*/, itemRequest.json()];
                case 2:
                    itemResponse = _a.sent();
                    itemListDiv = document.getElementById('item-list');
                    if (!itemListDiv) {
                        return [2 /*return*/];
                    }
                    itemListDiv.innerHTML = '';
                    if (itemResponse.error) {
                        showError("Die Gegenstände konnten nicht abgerufen werden. Sie werden in 3 Sekunden weitergeleitet..");
                        setTimeout(function () {
                            window.location.assign('../LoginAdmin.html');
                        }, 3000);
                    }
                    else {
                        i = 0;
                        itemResponse.items.forEach(function (item) {
                            if (!itemListDiv) {
                                return;
                            }
                            itemListDiv.appendChild(createItemElementAdmin(item));
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
startAdmin();
function createItemElementAdmin(item) {
    var mainDiv = document.createElement('div');
    mainDiv.setAttribute('class', 'artikel');
    var img = document.createElement('img');
    img.setAttribute('src', '../BilderAusleihzubehör/' + item.pic);
    img.setAttribute('class', 'picture');
    var pItemName = document.createElement('p');
    pItemName.setAttribute('class', 'item-name');
    pItemName.innerHTML = item.name;
    var pDescription = document.createElement('p');
    pDescription.setAttribute('class', 'item-desc');
    pDescription.innerHTML = item.beschreibung;
    var pItemStatus = document.createElement('p');
    pItemStatus.setAttribute('class', 'item-status');
    pItemStatus.innerHTML = "Status: " + item.status;
    var pReservedBy = document.createElement('p');
    pReservedBy.setAttribute('class', 'item-reserved');
    pReservedBy.innerHTML = "Reserviert von: " + item.owner;
    var btn;
    if (item.status === "reserviert") {
        btn = document.createElement('button');
        btn.innerHTML = "Auf ausgeliehen setzen.";
        btn.addEventListener('click', function () { return changeStatus(item.name); });
    }
    if (item.status === "ausgeliehen") {
        btn = document.createElement('button');
        btn.innerHTML = "Auf frei setzen.";
        btn.addEventListener('click', function () { return changeStatus(item.name); });
    }
    mainDiv.appendChild(img);
    mainDiv.appendChild(pItemName);
    mainDiv.appendChild(pDescription);
    mainDiv.appendChild(pItemStatus);
    mainDiv.appendChild(pReservedBy);
    if (btn) {
        mainDiv.appendChild(btn);
    }
    return mainDiv;
}
function changeStatus(itemName) {
    return __awaiter(this, void 0, void 0, function () {
        var params, itemRequest, itemResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = new URLSearchParams();
                    params.append('itemName', itemName);
                    return [4 /*yield*/, fetch(main_url + '/ChangeItemStatus?' + params.toString())];
                case 1:
                    itemRequest = _a.sent();
                    return [4 /*yield*/, itemRequest.json()];
                case 2:
                    itemResponse = _a.sent();
                    if (itemResponse.error) {
                        showError("Der Gegenstand konnte nicht bearbeitet werden.");
                    }
                    else {
                        //re render page
                        startAdmin();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
