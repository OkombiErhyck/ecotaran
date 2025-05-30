const mongoose = require('mongoose');

// Define the schema for the Order collection
const orderSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  motiv: { type: String, enum: ['Concediu de odihna ', 'Concediu fără plata', 'Concediu pentru evenimente speciale'], required: true },
  address: { type: String, enum: ['Capital Clean','Complete Recruitment'] ,required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  x: { type: String, required: true },
  y: { type: String, required: true },
  rep: { type: String, required: true },
 
  cartItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }],
  delivered: {
    type: Boolean,
    default: false
  },
  status: { type: String, default: 'Pending' },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Order model using the schema
const Order = mongoose.model('Order', orderSchema);

// Export the Order model
module.exports = Order;
