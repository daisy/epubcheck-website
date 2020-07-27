const moment = require('moment');
const path = require('path');
const fs = require('fs-extra');
const Cache = require("@11ty/eleventy-cache-assets");

// get the latest release from github
async function getMessages() {
    try {
        return JSON.parse(fs.readFileSync('src/_data/labels_long_descriptions.json'));
    }
    catch (err) {
        console.log("Error loading messages", err);
        return {};
    }
}

module.exports = async () => {
    let messages = await getMessages();
    return messages;
};