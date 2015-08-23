var express    = require('express');
var router = express.Router();
var Users     = require('./models/users.js');
var jwt = require('jsonwebtoken');
var config = require('./config.js');

var UTILS = module.exports;


// cette fonction retourn le statut du user à partir des infos cryptées dans son token JWT
UTILS.IsAuthenticated = function( token, callback){

        var decoded = jwt.verify(token, config.jwtKey );

        console.log('decoded.userId ' + decoded.userId);

        Users.findById( decoded.userId )
        .select('statut token boutiqueId')
        .exec(function(err, user) {
            if (err)
                res.send(err);

            if (user){
                console.log('user ' + user);
                if ( user.token===decoded.token ){
                    console.log('return userData ' + user);
                    callback( user );
                } else {
                    callback( null );
                }
            }

        });

};




