"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToPlaylist = void 0;
const axios_1 = __importDefault(require("axios"));
async function addToPlaylist(playlistId, trackId, accessToken) {
    await axios_1.default.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        uris: [`spotify:track:${trackId}`],
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}
exports.addToPlaylist = addToPlaylist;
//# sourceMappingURL=addToPlaylist.js.map