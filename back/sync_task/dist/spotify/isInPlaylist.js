"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInPlaylist = void 0;
const axios_1 = __importDefault(require("axios"));
async function isInPlaylist(playlistId, trackId, accessToken) {
    const response = await axios_1.default.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    for (const item of response.data.tracks.items) {
        if (item.track.id === trackId)
            return true;
    }
    return false;
}
exports.isInPlaylist = isInPlaylist;
//# sourceMappingURL=isInPlaylist.js.map