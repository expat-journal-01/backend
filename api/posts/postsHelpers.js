module.exports = {
    isPostDataValid
};

function isPostDataValid (data) {
    if (
        typeof data.title === "string" &&
        data.title.length > 1 &&
        data.storyId &&
        !isNaN(data.storyId) &&
        data.storyId > 0
    ) {
        return true;
    } else {
        return false;
    }
}