function stringToCharCode(str, sep) {
    var res = sep;
    for(i=0; i<str.length; i++) {
        res+=str.charCodeAt(i);
        res+=sep;
    }
    return res;
}

function charCodeToString(code, sep) {
    const regexp = new RegExp(`(?<=${sep})(.*?)(?=${sep})`, 'g');
    var res = code.match(regexp);
    return String.fromCharCode(...res);
}