"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = void 0;
const axios_1 = __importDefault(require("axios"));
const querystring_1 = __importDefault(require("querystring"));
const encodedCredentials = Buffer.from(`${process.env["SPOTIFY_CLIENT_ID"]}:${process.env["SPOTIFY_CLIENT_SECRET"]}`).toString("base64");
async function refreshAccessToken(refreshToken) {
    const response = await axios_1.default.post("https://accounts.spotify.com/api/token", querystring_1.default.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    }), {
        headers: {
            Authorization: `Basic ${encodedCredentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    const accessToken = response.data.access_token;
    return accessToken;
}
exports.refreshAccessToken = refreshAccessToken;
//# sourceMappingURL=refreshToken.js.map