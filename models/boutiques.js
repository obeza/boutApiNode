var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BoutiqueSchema   = new Schema({

    nom: { type :String, required: true },
    tel: String,
    infos: String,
    statut: { type: Number, enum : [0, 1], default : 1 },
    created_at: { type: Date, default: Date.now },
    credit_until: Date

});


// statut [
//   0 : desactive
//   1 : active
// ]


module.exports = mongoose.model('Boutiques', BoutiqueSchema);