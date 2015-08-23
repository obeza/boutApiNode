var express    = require('express');
var router = express.Router();
var Users     = require('../models/users.js');
//var sha1 = require('sha1');

var utils = require('../utils.js');

function IsAuthAdmin(req, res, next) {

    utils.IsAuthenticated(req.headers.token, function(userData){
        console.log('statut ' + userData.statut);
        if ( userData.statut === 2)
            next();
        else 
            res.json({ message: 'erreur !' });
    });

}

router.route('/user')
    .post(function(req, res) {
        
        var user = new Users();
        user.nom = req.body.nom;
        user.email = req.body.email;
        user.passe = user.generateHash(req.body.passe);
        user.statut = req.body.statut;
        user.tel = req.body.tel;
        user.boutiqueId = req.body.boutiqueId;
console.log('user2');
        // save the bear and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'user created!' });
        });
        
    })
	.get(function(req, res) {

		//res.json ( { token : req.headers.token } );

        Users.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });

    });

router.route('/user/:id')
	.get(function(req, res) {

		//res.json ( { token : req.headers.token } );

        Users.findById(req.params.id, function(err, users) {
            if (err)
                res.send(err);

            res.json( users );
        });

    })
	.put(function(req, res) {

        // use our bear model to find the bear we want
        Users.findById(req.params.id, function(err, user) {

            if (err)
                res.send(err);

            user.nom = req.body.nom;  // update the bears info
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


