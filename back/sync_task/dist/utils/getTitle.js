"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTitle = void 0;
const getTitle = (video) => {
    var _a, _b;
    let title = null;
    if (video.title.includes(" - "))
        title = (_a = video.title.split(" - ")[1]) === null || _a === void 0 ? void 0 : _a.trim();
    else if (video.title.includes(" | "))
        title = (_b = video.title.split(" | ")[1]) === null || _b === void 0 ? void 0 : _b.trim();
    else if (video.categoryId === "10")
        title = video.title;
    if (title) {
        const regex = /( (\(.*|\|.*|ft.*|feat.*|x.*)|\[.*)/gi;
        title = title.replace(regex, "");
    }
    return title;
};
exports.getTitle = getTitle;
//# sourceMappingURL=getTitle.js.map