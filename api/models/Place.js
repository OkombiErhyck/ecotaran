const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
  title: String,
  marca: String,
  culoare: String,
  putere: String,
  cilindre: String,
  caroserie: String,
  normaeuro: String,
  combustibil: String,
  seriesasiu: String,
  transmisie: String,
  tractiune: String,
  photos: [String],
  description: String,
  perks: [String],
  anul: String,
  model: String,
  km: Number,
  nume:String,
  mail: String,
  telefon: String



});

const PlaceModel = mongoose.model('Place', placeSchema);

module.exports = PlaceModel;