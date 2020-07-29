const fs = require("fs");

module.exports = {
    isPostDataValid,
    removeImage
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


function removeImage (imagePath) {
    fs.unlink(imagePath, (error) => {
        if (error) {
            throw error;
        };
    });
}