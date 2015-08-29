var mongoose     = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    nom: { type :String, required: true },
    email: String,
    tel: String,
    passe: String,
    boutiqueId: { type: Schema.ObjectId },
    statut: { type: Number, enum : [0, 1, 2], default : 0 },
    token: String,
    created_at: Date,
  	updated_at: Date

});

//
//  statut : [
//   0 : désactivé
//   1 : utilisateur
//   2 : admin
//  ]
//

UserSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  console.log("date " + currentDate);
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.passe);
};

UserSchema.methods.validToken = function(token) {
  if ( token === this.token )
    return true;
  else
    return false
};

module.exports = mongoose.model('Users', UserSchema);





