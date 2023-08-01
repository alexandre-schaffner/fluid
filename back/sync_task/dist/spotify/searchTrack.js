"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTrack = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
async function searchTrack(artist, title, accessToken) {
    const queryStringified = querystring_1.default.stringify({
        q: `artist:${artist} track:${title}`,
        type: "track",
        limit: 5,
    });
    return await axios_1.default.get(`https://api.spotify.com/v1/search?${queryStringified}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}
exports.searchTrack = searchTrack;
//# sourceMappingURL=searchTrack.js.map