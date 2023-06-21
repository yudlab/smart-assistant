console.clear()
console.log("-----------------------------------------------------");
const app = require('express')();
var server = require('http').Server(app);
const bodyParser = require('body-parser');
var cors = require('cors');
const port = 3002;
var fs = require('fs');

//app.use(bodyParser.urlencoded({ extended: true }))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

server.listen(port, 'localhost');
console.log("Started on port: ", port)
// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')
    res.setHeader('Content-Security-Policy', 'default-src *')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Credentials', false);
    next()
})
app.use(cors());

async function readJson(path) {
    try {
        const data = await fs.promises.readFile(path, 'utf8');
        const jsonObject = JSON.parse(data);
        return jsonObject;
    } catch (error) {
        console.error(error);
    }
}

app.get('/', async (req, res) => {
    let json = await readJson("./data/dates.json");
    res.send(json);
}); //response should always be in JSON format else considered as an error.

app.post('/new', async function(req, res){
    let data = {};
    res.send(data);
});