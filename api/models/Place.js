const mongoose = require('mongoose');

const modificationEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  field: String,
  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const placeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
  nume: String,
  mail: String,
  telefon: String,
  modificationHistory: [modificationEntrySchema],
  documents: [{ type: String }],

  family: { type: String, required: true }, // ⬅️ new field // 🔑 NEW → family name/group
});
 


const PlaceModel = mongoose.model('Place', placeSchema);

module.exports = PlaceModel;
 
