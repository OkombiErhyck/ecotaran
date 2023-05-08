const mongoose = require('mongoose');

// Define the schema for the Order collection
const orderSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  sector:  { type: String, required: true },
  cartItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }],
  status: { type: String, default: 'Pending' },
  delivered: { type: Boolean, default: false },
  delivered: {
    type: Boolean,
    default: false
  },
  status: { type: String, default: 'Pending' }, // new field for status
  delivered: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now // Automatically set the field to the current date and time when an order is created
  }
});

// Create the Order model using the schema
const Order = mongoose.model('Order', orderSchema);

// Export the Order model
module.exports = Order;
