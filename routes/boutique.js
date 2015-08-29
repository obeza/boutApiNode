var express    = require('express');
var router = express.Router();
var Users     = require('../models/users.js');
var Boutiques     = require('../models/boutiques.js');

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


router.route('/boutique')
// create a bear (accessed at POST http://localhost:8080/api/bears)
    .post( IsAuthAdmin, function(req, res) {
        
        var boutique = new Boutiques();

        boutique.nom = req.body.nom;
        boutique.tel = req.body.tel;
        boutique.infos = req.body.infos;

        boutique.save(function(err) {
            if (err)
                res.send(err);

        });

        res.json({ msg: 'ok' });

    })
	.get(function(req, res) {

		//res.json ( { token : req.headers.token } );

        Boutiques.find(function(err, boutiques) {
            if (err)
                res.send(err);

            res.json(boutiques);
        });

    });

router.route('/boutique/:id')
	.get(function(req, res) {

        Contenus.findById(req.params.id, function(err, contenu) {
            if (err)
                res.send(err);

            res.json( contenu );
        });

    })
	.put(function(req, res) {

        Contenus.findById(req.params.id, function(err, contenu) {

            if (err)
                res.send(err);

            contenu.titre = req.body.titre;
            contenu.texte = req.body.texte;
            contenu.statut = req.body.statut;

            contenu.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User updated!' });
            });

        });
    });

module.exports = router;


