const app = require('express')();
var server = require('http').Server(app);
const bodyParser = require('body-parser');
var cors = require('cors');
require('dotenv').config();
const { fileHandler } =  require('./core/functions');
const corsOptions = {
	origin: 'http://localhost:3003',
	optionsSuccessStatus: 200
};


console.clear()
console.log(`-BACKEND API PORT: ${process.env.BACKEND_PORT}---------------------------------------------------`);


//app.use(bodyParser.urlencoded({ extended: true }))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.setHeader('Content-Security-Policy', "default-src 'self' localhost:* ws://localhost:*")
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.setHeader('Access-Control-Allow-Credentials', false);
    next()
})


app.use(cors(corsOptions));

server.listen(process.env.BACKEND_PORT, 'localhost');

app.post('/query', async (req, res) => {
    console.log("Query is: ")
    console.log(req.body)
    res.send(JSON.stringify({req: req.body}));
}); //response should always be in JSON format else considered as an error.

app.post('/new', async function(req, res){
    let data = {};
    res.send(data);
});