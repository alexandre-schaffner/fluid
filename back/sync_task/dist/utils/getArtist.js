"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArtist = void 0;
const getArtist = (video) => {
    var _a, _b, _c;
    let artist;
    if (video.title.includes(" - "))
        artist = (_a = video.title.split(" - ")[0]) === null || _a === void 0 ? void 0 : _a.trim();
    else if (video.title.includes(" | "))
        artist = (_b = video.title.split(" | ")[0]) === null || _b === void 0 ? void 0 : _b.trim();
    else if (video.categoryId === "10") {
        artist = video.channelTitle;
        if (artist.includes(" - "))
            artist = (_c = artist.split(" - ")[0]) === null || _c === void 0 ? void 0 : _c.trim();
    }
    if (!artist)
        return null;
    const regex = /( (\(.*|ft.*|feat.*|x.*)|,.*| &.*)/gi;
    artist = artist.replace(regex, "");
    return artist;
};
exports.getArtist = getArtist;
//# sourceMappingURL=getArtist.js.map