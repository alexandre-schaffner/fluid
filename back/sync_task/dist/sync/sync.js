"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sync_v2 = void 0;
const googleapis_1 = require("googleapis");
const addToPlaylist_1 = require("../spotify/addToPlaylist");
const isInPlaylist_1 = require("../spotify/isInPlaylist");
const refreshToken_1 = require("../spotify/refreshToken");
const searchTrack_1 = require("../spotify/searchTrack");
const getArtist_1 = require("../utils/getArtist");
const getTitle_1 = require("../utils/getTitle");
const getLastLikedVideos_1 = require("../youtube/getLastLikedVideos");
async function sync_v2(user, prisma) {
    var _a;
    if (!user.Youtube || !user.Platform) {
        throw new Error(`Cannot sync ${user.id}: the user has missing token(s).`);
    }
    if (!user.Platform.playlistUniqueRef) {
        throw new Error(`Cannot sync ${user.id}: the user has not set a playlist to sync.`);
    }
    const googleClient = new googleapis_1.google.auth.OAuth2(process.env["GOOGLE_CLIENT_ID"], process.env["GOOGLE_CLIENT_SECRET"], process.env["GOOGLE_REDIRECT_URI"]);
    googleClient.setCredentials({
        refresh_token: user.Youtube.refreshToken,
    });
    const youtube = googleapis_1.google.youtube({
        version: "v3",
        auth: googleClient,
    });
    const { lastLikedVideos, etag } = await (0, getLastLikedVideos_1.getLastLikedVideos)(youtube, (_a = user.Youtube.likedVideoEtag) !== null && _a !== void 0 ? _a : "");
    if (lastLikedVideos.length === 0)
        return;
    const accessToken = await (0, refreshToken_1.refreshAccessToken)(user.Platform.refreshToken);
    for (const video of lastLikedVideos) {
        if (user.Youtube.lastLikedVideos.includes(video))
            continue;
        const artist = (0, getArtist_1.getArtist)(video);
        const title = (0, getTitle_1.getTitle)(video);
        console.log(`Artist: ${artist}, Title: ${title}`);
        if (!artist || !title)
            continue;
        const search = await (0, searchTrack_1.searchTrack)(artist, title, accessToken);
        let bestMatch = "";
        let bestMatchScore = 0;
        for (const item of search.data.tracks.items) {
            let score = 0;
            if (item.artists
                .map((artist) => artist.name.toLowerCase())
                .includes(artist.toLowerCase()))
                score++;
            if (item.name.toLowerCase() === title.toLowerCase)
                score++;
            if (score > bestMatchScore) {
                bestMatch = item.id;
                bestMatchScore = score;
            }
        }
        if (bestMatch &&
            !(await (0, isInPlaylist_1.isInPlaylist)(user.Platform.playlistUniqueRef, bestMatch, accessToken))) {
            await (0, addToPlaylist_1.addToPlaylist)(user.Platform.playlistUniqueRef, bestMatch, accessToken);
        }
    }
    prisma.youtube.update({
        where: {
            userId: user.id,
        },
        data: {
            lastLikedVideos,
            likedVideoEtag: etag,
        },
    });
}
exports.sync_v2 = sync_v2;
//# sourceMappingURL=sync.js.map