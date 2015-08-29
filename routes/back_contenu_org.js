var express    = require('express');
var router = express.Router();
var Contenus     = require('../models/contenus.js');
var Users     = require('../models/users.js');
var multer = require('multer');
var utils = require('../utils.js');

var config = require('../config.js');

fs = require('fs'),
S3FS = require('s3fs'),
s3fsImpl = new S3FS('boutcontenuimage', config.awsOptions );
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();

s3fsImpl.create();

function IsAuth(req, res, next) {

    var token = req.headers.token;
    if( token ){

        utils.IsAuthenticated( token, function(userData){

            if ( userData.statut > 0 ){
                req.userData = userData;
                next();
            } else
                res.sendStatus(401);

        });

    } else {
        res.sendStatus(401);
    }
}

router.use(multipartyMiddleware);

router.route('/contenu')

    .get( function(req, res) {

        Contenus.find(function(err, contenus) {
            if (err)
                res.send(err);

            res.json(contenus);
        });

    })
    .post( function(req, res) {
        if (req.files.file === undefined){
            res.end("error, no file chosen");
        }
        var file = req.files.file;
        console.log(file);
        
        var stream = fs.createReadStream(file.path);

        s3fsImpl.writeFile(file.originalFilename, stream).then(function () {    
            // on efface le fichier sur le serveur de l'API
            fs.unlink(file.path, function (err) {
                if (err)
                    console.error(err);              
            });
        res.json({ msg: 'ok' });
        });

        // var contenu = new Contenus();
        // contenu.titre = req.body.titre;
        // contenu.texte = req.body.texte;

        // contenu.auteurId = req.userData._id;
        // contenu.boutiqueId = req.userData.boutiqueId;

        // contenu.save(function(err) {
        //     if (err)
        //         res.send(err);

             res.json({ msg: 'ok' });

        // });

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


