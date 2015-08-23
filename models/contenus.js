var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ContenuSchema   = new Schema({

    titre: { type :String, required: true },
    texte: String,
    auteurId: { type: Schema.ObjectId, required: true },
    boutiqueId: { type: Schema.ObjectId, required: true },
    statut: { type: Number, enum : [0, 1, 2], default : 1 },
    created_at: Date,
  	updated_at: Date,
    updated_by: { type: Schema.ObjectId, required: true },
    publication_at: Date

});


// statut [
//   0 : destactive
//   1 : brouillon
//   2 : en ligne
// ]


ContenuSchema.pre('save', function(next) {
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

module.exports = mongoose.model('Contenus', ContenuSchema);