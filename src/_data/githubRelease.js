const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

// get the latest release from github
async function getLatestRelease() {
    try {
        let release = await axios.get('https://api.github.com/repos/w3c/epubcheck/releases/latest');
        return {
            url: release.data.assets[0].browser_download_url,
            version: release.data.tag_name,
            date: moment(release.data.published_at).format('YYYY-MM-DD')
        };
    }
    catch (err) {
        console.log("Error fetching latest release", err);
        return {
            url: "https://github.com/w3c/epubcheck/releases/",
            version: "",
            date: ""
        };
    }
}

module.exports = async () => {
    let latest = await getLatestRelease();
    return {latest};
};