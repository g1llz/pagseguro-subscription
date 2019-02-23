// third party code to remove _text attribute in a xml to json convertion
const removeJsonTextAttribute = (value, parentElement) => {
    try {
        const keyNo = Object.keys(parentElement._parent).length;
        const keyName = Object.keys(parentElement._parent)[keyNo - 1];
        parentElement._parent[keyName] = value;
    } catch (err) {
        console.log(err);
    }
}

const xml2Opt = {
    compact: true,
    trim: true,
    ignoreDeclaration: true,
    ignoreInstruction: true,
    ignoreAttributes: true,
    ignoreComment: true,
    ignoreCdata: true,
    ignoreDoctype: true,
    textFn: removeJsonTextAttribute
}

module.exports = xml2Opt;
