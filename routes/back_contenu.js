var express    = require('express');
var router = express.Router();
var Contenus     = require('../models/contenus.js');
var Users     = require('../models/users.js');
var multer = require('multer');
var utils = require('../utils.js');

var config = require('../config.js');

fs = require('fs');

var aws = require('aws-sdk');
aws.config.loadFromPath('./AwsConfig.json');
var BUCKET_NAME = 'boutcontenuimage';
var s3 = new aws.S3();

var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();

function uploadFile(remoteFilename, fileName, contentType, callBack) {
  var fileBuffer = fs.readFileSync(fileName);
  //var metaData = getContentTypeByFile(fileName);
  //console.log('metadata ====>>' + metaData);
  s3.putObject({
    ACL: 'public-read',
    Bucket: BUCKET_NAME,
    Key: remoteFilename,
    Body: fileBuffer,
    ContentType: contentType
  }, function(error, response) {
    //console.log('uploaded file[' + fileName + '] to [' + remoteFilename + '] as [' + metaData + ']');
    //console.log(arguments);
    console.log("response " + response);
    var msg = 'ok';
    if (error)
        msg= error;

    callBack(msg);

  });
}

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
        console.log(req.param, req.files);

        if (req.files.file === undefined){
            res.end("error, no file chosen");
        }
        var file = req.files.file;
        //console.log(file);
        
        //var stream = fs.createReadStream(file.path);

        uploadFile( 
            file.originalFilename, 
            file.path, 
            file.headers['content-type'], 
            function(msg){
            fs.unlink(file.path, function (err) {
                if (err)
                    console.error(err);              
            });
                console.log('msg ' + msg);
                if (msg==="ok")
                    res.json({ msg: 'ok' });
                else
                    res.send(msg);
        });
        // var data = JSON.parse(req.param('data'));
        // res.json(data.nom);

        

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


