const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const multer = require('multer');
const bodyParser = require('body-parser');
const CookieParser = require("cookie-parser");
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require("fs");
const os = require('os');
require("dotenv").config();

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "123456789";
const bucket = 'ecotaran';

app.use(express.json({ limit: '50mb' }));
app.use(CookieParser());

// CORS setup (adjust origin and credentials as needed)
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000",
}));

app.use("/uploads", express.static(__dirname + "/uploads"));

// Connect to Mongo once on app startup
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Upload to AWS S3 helper
async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: 'eu-north-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const parts = originalFilename.split('.');
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + '.' + ext;

  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Body: fs.readFileSync(path),
    Key: newFilename,
    ContentType: mimetype,
    ACL: 'public-read',
  }));

  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

// Multer setup to use OS temp directory
const photosMiddleware = multer({ dest: os.tmpdir(), limits: { fileSize: 80 * 1024 * 1024 } });

// Order schema & model
const orderSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  city: String,
  x: String,
  y: String,
  rep: String,
  zipCode: String,
  cartItems: [],
  createdAt: Date,
  status: { type: String, default: 'Pending' },
});

const Order = mongoose.model('Order', orderSchema);

// Routes

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (!userDoc) return res.status(404).json("not found");

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) return res.status(422).json("pass not ok");

    jwt.sign({ email: userDoc.email, id: userDoc._id, name: userDoc.name }, jwtSecret, {}, (err, token) => {
      if (err) throw err;

      // For local dev http, use sameSite:'lax' and secure:false
      res.cookie("token", token, { sameSite: 'lax', secure: false }).json(userDoc);
    });
  } catch (err) {
    res.status(500).json("Login error");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.json(null);

  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    if (err) return res.json(null);
    res.json(user);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0) }).json(true);
});

app.post("/upload", photosMiddleware.single('photo'), async (req, res) => {
  try {
    const { path, originalname, mimetype } = req.file;
    const url = await uploadToS3(path, originalname, mimetype);
    res.json(url);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Order endpoints
app.post('/orders', async (req, res) => {
  try {
    const { firstName, lastName, email, address, city, zipCode, x, y, rep, cartItems, status } = req.body;
    const newOrder = new Order({
      firstName,
      lastName,
      email,
      address,
      city,
      x,
      y,
      rep,
      zipCode,
      cartItems,
      createdAt: new Date(),
      status,
    });
    await newOrder.save();
    res.status(200).json({ message: 'Order saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save order' });
  }
});

app.put('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

app.put('/orders/:orderId/markDelivered', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = 'Delivered';
    await order.save();
    res.status(200).json({ message: 'Order marked as delivered' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark order as delivered' });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// Places endpoints
app.post("/places", (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json("Unauthorized");

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json("Unauthorized");

    const {
      title, marca, model, km, anul, addedPhotos, description, perks,
      culoare, nume, mail, telefon, cilindre, tractiune, transmisie,
      seriesasiu, caroserie, putere, normaeuro, combustibil,
    } = req.body;

    try {
      const placeDoc = await Place.create({
        owner: userData.id,
        title,
        marca,
        anul,
        model,
        km,
        nume,
        mail,
        telefon,
        photos: addedPhotos,
        description,
        perks,
        culoare,
        cilindre,
        tractiune,
        transmisie,
        seriesasiu,
        caroserie,
        putere,
        normaeuro,
        combustibil,
      });
      res.json(placeDoc);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create place' });
    }
  });
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json("Unauthorized");

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json("Unauthorized");

    const places = await Place.find({ owner: userData.id });
    res.json(places);
  });
});

app.get("/places", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    res.status(500).json("Server error");
  }
});

app.get("/places/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id)
      .populate("modificationHistory.user", "username email");
    if (!place) return res.status(404).json("Place not found");
    res.json(place);
  } catch (error) {
    res.status(500).json("Server error");
  }
});

app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });

    const {
      id, title, marca, model, km, anul, addedPhotos, description, perks, culoare,
      cilindre, tractiune, transmisie, seriesasiu, caroserie, putere, normaeuro,
      combustibil, nume, mail, telefon,
    } = req.body;

    try {
      const placeDoc = await Place.findById(id);
      if (!placeDoc) return res.status(404).json({ error: "Place not found" });

      const updatedFields = {
        title,
        marca,
        anul,
        model,
        km,
        photos: addedPhotos,
        description,
        perks,
        culoare,
        cilindre,
        tractiune,
        transmisie,
        nume,
        mail,
        telefon,
        seriesasiu,
        caroserie,
        putere,
        normaeuro,
        combustibil,
      };

      const changes = [];

      for (const key of Object.keys(updatedFields)) {
        const oldVal = JSON.stringify(placeDoc[key] || null);
        const newVal = JSON.stringify(updatedFields[key] || null);
        if (oldVal !== newVal) {
          changes.push({
            user: userData.id,
            field: key,
            oldValue: placeDoc[key],
            newValue: updatedFields[key],
            timestamp: new Date(),
          });
        }
      }

      const currentOwner = placeDoc.owner ? placeDoc.owner.toString() : null;
      let ownershipTransferred = false;
      if (userData.id !== currentOwner) {
        changes.push({
          user: userData.id,
          field: "owner",
          oldValue: currentOwner,
          newValue: userData.id,
          timestamp: new Date(),
        });
        placeDoc.owner = userData.id;
        ownershipTransferred = true;
      }

      placeDoc.set(updatedFields);

      if (!placeDoc.modificationHistory) {
        placeDoc.modificationHistory = [];
      }

      placeDoc.modificationHistory.push(...changes);
      await placeDoc.save();

      res.json({
        status: "ok",
        ownershipTransferred,
        message: ownershipTransferred
          ? "Updated and ownership transferred."
          : "Updated.",
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

app.delete("/places/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlace = await Place.findByIdAndDelete(id);
    if (!deletedPlace) return res.status(404).send("Place not found");
    res.json(deletedPlace);
  } catch (error) {
    res.status(500).send("Failed to delete place.");
  }
});

// Password reset endpoint
app.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed' });
  }
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
