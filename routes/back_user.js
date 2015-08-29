var express    = require('express');
var router = express.Router();
var Users     = require('../models/users.js');

var jwt = require('jsonwebtoken');
var config = require('../config.js');

function IsToken(req, res, next) {

    var token = req.headers.token;

    var decoded = jwt.verify(token, config.jwtKey );

    if ( token ){
        req.tokenData
        next();
    } else
        res.sendStatus(401);

}

router.route('/backuser')
	.get( IsToken, function(req, res) {

        if ( req.tokenData.userId ){
            Users.findById( req.tokenData.userId, function(err, user) {
                if (err)
                    res.send(err);

                if (user)
                    res.json(user);
                else
                    res.sendStatus(401);
            });
        } else
            res.sendStatus(401);

    })
	.post( IsToken, function(req, res) {

        if ( req.tokenData.userId ){

            Users.findById(req.tokenData.userId, function(err, user) {

                if (err)
                    res.send(err);

                if (user){

                    user.nom = req.body.nom;
                    user.email = req.body.email;
                    user.tel = req.body.tel;

                    user.save(function(err) {
                        if (err)
                            res.send(err);

                        res.json({ msg: 'ok' });
                    });

                } else
                    res.sendStatus(401);

            });

        } else
            res.sendStatus(401);

    });


module.exports = router;


