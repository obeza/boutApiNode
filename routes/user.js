var express    = require('express');
var router = express.Router();
var Users     = require('../models/users.js');
//var sha1 = require('sha1');

var utils = require('../utils.js');

function IsAuthAdmin(req, res, next) {

    var token = req.headers.token;
    if ( token ){
        utils.IsAuthenticated( token, function(userData){

            if ( userData.statut === 2)
                next();
            else {
                res.sendStatus(401);
            }

        });
    } else 
        res.sendStatus(401);

}

router.route('/user')
    .post( IsAuthAdmin, function(req, res) {
        
        var user = new Users();
        user.nom = req.body.nom;
        user.email = req.body.email;
        user.passe = user.generateHash( req.body.passe );
        user.statut = req.body.statut;
        user.tel = req.body.tel;
        user.boutiqueId = req.body.boutiqueId;

        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'user created!' });
        });
        
    })
	.get(function(req, res) {

        Users.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });

    });

router.route('/user/:id')
	.get(function(req, res) {

        Users.findById(req.params.id, function(err, users) {
            if (err)
                res.send(err);

            res.json( users );
        });

    })
	.put(function(req, res) {

        //var decoded = jwt.verify(token, config.jwtKey );

        Users.findById(req.params.id, function(err, user) {

            if (err)
                res.send(err);

            if (user){

                user.nom = req.body.nom;
                user.email = req.body.email;
                //user.passe = req.body.passe;
                user.statut = req.body.statut;
                user.tel = req.body.tel;
                user.boutiqueId = req.body.boutiqueId;

                // save the bear
                user.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'User updated!' });
                });
            } else {
                res.sendStatus(401);
            }

        });
    })
    .delete( IsAuthAdmin, function(req, res, next) {

        Users.findByIdAndRemove(req.params.id, function(err) {
            if (err) throw err;

            // we have deleted the user
            res.json({ message: 'User deleted!' });

        });
  
    });


module.exports = router;


