console.clear()
console.log("-----------------------------------------------------");
const app = require('express')();
var server = require('http').Server(app);
const bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config();
const { fileHandler } =  require('./core/functions');

//app.use(bodyParser.urlencoded({ extended: true }))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cors({
    origin: [`${process.env.VITE_FRONTEND_URL}`, `${process.env.VITE_BACKEND_URL}`]
}));

app.use(function (req, res, next) {
    res.setHeader('Content-Security-Policy', 'default-src *')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Credentials', false);
    next()
})


server.listen(process.env.BACKEND_PORT, 'localhost');

app.post('/query', async (req, res) => {
    console.log("Query is: ")
    console.log(req.body.query)
    let json = await fileHandler({
        path: "./data/dates.json"
    });
    res.send({text: "ok"});
}); //response should always be in JSON format else considered as an error.

app.post('/new', async function(req, res){
    let data = {};
    res.send(data);
});