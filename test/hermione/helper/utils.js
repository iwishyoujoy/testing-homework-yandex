const BUG_ID = process.env.BUG_ID;

const getUrlWithBug = (url) => {
    if (BUG_ID) {
        return url + "?bug_id=" + BUG_ID;
    }

    return url;
}

module.exports = {
    getUrlWithBug
};