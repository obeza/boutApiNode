var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var utils = require('./utils.js');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/olivier'); // connect to our database

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

//app.use(utils.isAuthAdmin());

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

app.use('/api', require('./routes/user.js') );

app.use('/api', require('./routes/login.js') );

app.use('/api', require('./routes/contenu.js') );

app.use('/api', require('./routes/boutique.js') );


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);