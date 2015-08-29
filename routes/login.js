var express    = require('express');
var router = express.Router();
var Users     = require('../models/users.js');
//var sha1 = require('sha1');
var crypto = require('crypto');

var jwt = require('jsonwebtoken');
var config = require('../config.js');

router.route('/login')
	.post(function(req, res) {

		Users.findOne({ 
			email : req.body.email
		}, function( err, user) {
			var msg = { msg : 'erreur' };		

	        if (err)
	            res.send(err);
	        
	        if (!user)
	        	return res.json({ msg : 'erreur' });

	        console.log('user ' + user)
		    if (user.validPassword(req.body.passe)) {        	
				var token = crypto.randomBytes(64).toString('hex');

				var jwtToken = jwt.sign({
					token: token,
					userId: user._id
				}, config.jwtKey );

				user.token = token;
				user.save(function(err) {
		            if (err)
		               res.send(err);

		        });

				msg = { 
					msg : 'ok',
					token : jwtToken
				};
				
			}

			res.json(msg);
	        
	    });
	        
	})
	.get(function(req, res) {

		//res.json ( { token : req.headers.token } );
		var decoded = jwt.verify(req.headers.token, config.jwtKey );

        Users.findById(decoded.userId, function(err, user) {
            if (err)
                res.send(err);

            res.json(user);
        });

    });

module.exports = router;