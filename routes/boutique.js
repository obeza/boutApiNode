var express    = require('express');
var router = express.Router();
var Users     = require('../models/users.js');
var Boutiques     = require('../models/boutiques.js');

function isAuthAdmin(req, res, next) {

    Users.findOne( {
        _id : req.body.id,
        statut : 2,
        token : req.headers.token
    })
    .select('statut token')
    .exec(function(err, user) {

        if (err)
            res.send(err);

        if (user) 
            next();
        else
            res.json( { msg : "erreur"} );
         
    });
 
}


router.route('/boutique')
// create a bear (accessed at POST http://localhost:8080/api/bears)
    .post( isAuthAdmin, function(req, res) {
        
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

        Contenus.find(function(err, contenus) {
            if (err)
                res.send(err);

            res.json(contenus);
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


