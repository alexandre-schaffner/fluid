"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastLikedVideos = void 0;
async function getLastLikedVideos(youtube, lastETag = "") {
    const list = await youtube.videos.list({
        part: ["snippet"],
        fields: "items(snippet/title,snippet/categoryId,snippet/channelTitle,id),etag",
        myRating: "like",
    }, {
        headers: { "If-None-Match": lastETag },
    });
    if (list.status === 304)
        return { lastLikedVideos: [], etag: lastETag };
    const lastLikedVideos = list.data.items.map((item) => {
        return {
            id: item.id,
            channelTitle: item.snippet.channelTitle,
            title: item.snippet.title,
            categoryId: item.snippet.categoryId,
        };
    });
    return { lastLikedVideos, etag: list.data.etag };
}
exports.getLastLikedVideos = getLastLikedVideos;
//# sourceMappingURL=getLastLikedVideos.js.map