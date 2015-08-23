var express    = require('express');
var router = express.Router();
var Contenus     = require('../models/contenus.js');
var Users     = require('../models/users.js');

var utils = require('../utils.js');

function IsAuth(req, res, next) {

    utils.IsAuthenticated(req.headers.token, function(userData){

        if ( userData.statut > 0 ){
            req.userData = userData;
            next();
        } else
            res.json({ message: 'erreur !' });

    });

}

router.route('/contenus')
.post( function(req, res) {

    Contenus.find(function(err, contenus) {
        if (err)
            res.send(err);

        res.json(contenus);
    });

});
router.route('/contenu')
// create a bear (accessed at POST http://localhost:8080/api/bears)
    .post( IsAuth, function(req, res) {
        
        var contenu = new Contenus();
        contenu.titre = req.body.titre;
        contenu.texte = req.body.texte;

        contenu.auteurId = req.userData._id;
        contenu.boutiqueId = req.userData.boutiqueId;

        contenu.save(function(err) {
            if (err)
                res.send(err);

        });

        res.json({ msg: 'ok' });

    });

router.route('/contenu/:id')
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


