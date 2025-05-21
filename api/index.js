const express = require('express');
const cors = require("cors");
const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
require("dotenv").config();
const app = express();
const CookieParser = require("cookie-parser");
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const fs =require("fs");
const Place =require("./models/Place.js");
const multer = require('multer');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({ limit: '50mb' });
app.use(jsonParser);

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "123456789";
const bucket = 'ecotaran'




app.use(express.json());
app.use(CookieParser());
app.use("/uploads", express.static(__dirname+"/uploads"));
app.use(cors({
    credentials: true,
    origin: "https://ecotaran.vercel.app", 
}));


async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: 'eu-north-1',
    credentials: {

      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },

  });

  const parts =originalFilename.split('-');
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + '-' + ext;
 await client.send(new PutObjectCommand({
    Bucket: bucket,
    Body: fs.readFileSync(path),
    Key: newFilename,
    ContentType: mimetype,
    ACL: 'public-read',
  }));
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}




app.get("/test", (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
    res.json("test ok");
});

mongoose.connect(process.env.MONGO_URL);
const orderSchema = new mongoose.Schema({
  // Define the fields for the order collection
  // For example:
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
  createdAt:  Date,
  status: {
    type: String,
    default: 'Pending' // Set default status to 'Pending'
  },
});



// Create the "orders" model based on the schema
const Order = mongoose.model('Order', orderSchema);

// Make sure the "orders" collection exists in the database
mongoose.connection.once('open', () => {
  mongoose.connection.db.listCollections({ name: 'orders' }).toArray((err, collections) => {
    if (err) {
      console.error(err);
    } else {
      if (collections.length === 0) {
        mongoose.connection.db.createCollection('orders', (error) => {
          if (error) {
            console.error(error);
          } else {
            console.log('The "orders" collection has been created successfully.');
          }
        });
      }
    }
  });
});


app.post("/register", async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.header("Access-Control-Allow-Credentials", "true");
res.set("Access-Control-Allow-Origin", "https://ecotaran.vercel.app");
    const {name,email,password} = req.body;

    try { 
    const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
    });


    res.json(userDoc);
} catch (e) {
    res.status(422).json(e);
}


});

app.post("/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Origin", "https://ecotaran.vercel.app");
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign({email:userDoc.email, id:userDoc._id, name:userDoc.name}, jwtSecret, {}, (err, token) => {
             if (err) throw err;
        
        res.cookie("token", token, { sameSite: 'none', secure: true }).json(userDoc);

    });



      } else {
        res.status(422).json("pass not ok");
      }
    } else {
      res.status(404).json("not found");
    }
  });

  
  app.get("/profile", (req,res) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Allow-Origin", "https://ecotaran.vercel.app");
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, user) => {
               if (err) throw err;
               
               res.json(user);
         });
    } else {
        res.json(null);
    }
  });


app.post("/logout", (req,res) => {
  
  res.cookie("token", "").json(true);
});


const photosMiddleware = multer({dest:'/tmp',  limits: { fileSize: 80000000 }});
app.options("/upload", (req, res) => {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Methods", "POST");
 res.header("Access-Control-Allow-Headers", "Content-Type");
 res.send();
});
 
app.post("/upload", photosMiddleware.single('photo'), async (req, res) => {
  const { path, originalname, mimetype } = req.file;
  const url = await uploadToS3(path, originalname, mimetype);
  res.json(url);
});


app.post('/orders', (req, res) => {mongoose.connect(process.env.MONGO_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  const { firstName, lastName, email, address, city, zipCode, x, y, rep, cartItems,status } = req.body;

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

  newOrder.save()
    .then(() => {
      res.status(200).json({ message: 'Order saved successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to save order' });
    });
});


app.put('/orders/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const status = req.body.status || 'Processing'; // Use default value if status is not provided

  Order.findByIdAndUpdate(
    orderId,
    { delivered: true, status }, // Update delivered and status fields
    { new: true },
    (err, order) => {
      if (err) {
        console.error(err);
        res.status(500).send('Failed to mark order as delivered');
      } else {
        res.send(order);
      }
    }
  );
});




app.get('/orders', async (req, res) => {
  try {
    // Retrieve the orders from the database
    const orders = await Order.find();

    // Send the orders as the response
    res.json(orders);
  } catch (error) {
    console.error('Failed to retrieve orders: ', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

app.post("/places", (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Origin", "https://ecotaran.vercel.app");
  const {token} = req.cookies;
  const {title, marca, model, km, anul, addedPhotos, description, perks,
    culoare,
    nume,
    mail,
    telefon,
    cilindre,
    tractiune,
    transmisie,
    seriesasiu,
    caroserie,
    putere,
    normaeuro,
    combustibil} = req.body;
  jwt.verify(token, jwtSecret, {}, (err, userData) => {
    if (err) throw err;
    const placeDoc = Place.create({
      owner: userData.id,
      title,
      marca,
      anul,
      model,
      km,
      nume,
    mail,
    telefon,
      photos:addedPhotos,
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
      combustibil

    });
    res.json(placeDoc);
  });
});





app.get("/user-places", (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Origin", "https://ecotaran.vercel.app");
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err,userData) => {
    const {id} = userData;
    res.json(await Place.find({owner:id}));
  });
});


app.get("/places/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Origin", "https://ecotaran.vercel.app");

  const { id } = req.params;

  const place = await Place.findById(id)
    .populate("modificationHistory.user", "username email"); // ⬅️ Add this line

  res.json(place);
});


  app.put("/places", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    res.header("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Allow-Origin", "https://ecotaran.vercel.app");

    const { token } = req.cookies;
    const {
      id, title, marca, model, km, anul, addedPhotos, description, perks, culoare,
      cilindre, tractiune, transmisie, seriesasiu, caroserie, putere, normaeuro,
      combustibil, nume, mail, telefon,
    } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) return res.status(401).json({ error: "Unauthorized" });

      const placeDoc = await Place.findById(id);
      if (!placeDoc) return res.status(404).json({ error: "Place not found" });

      // Prepare updated fields object
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

      // Track changes
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

      // Safe check before comparing ownership
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

      // Apply updates
      placeDoc.set(updatedFields);

      // Ensure modification history exists
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
    });
  } catch (error) {
    console.error("Error updating place:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/places", async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Origin", "https://ecotaran.vercel.app");
  res.json( await Place.find() );
});



app.get("/places/:id", async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const place = await Place.findById(req.params.id)
      .populate("modificationHistory.user", "username email"); // populate user with username and email

    if (!place) return res.status(404).json("Place not found");
    res.json(place);
  } catch (error) {
    res.status(500).json("Server error");
  }
});




// Endpoint for resetting password
app.post('/reset-password', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Origin", "https://ecotaran.vercel.app");
  const { email, newPassword } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user's password
  await User.updateOne({ email }, { password: hashedPassword });

  res.status(200).json({ message: 'Password reset successful' });
});





app.delete("/places/:id", (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Origin","https://ecotaran.vercel.app");
  const {id} = req.params;
  Place.findByIdAndDelete(id, (err, deletedPlace) => {
    if (err) {
      console.log(err);
      res.status(500).send("Failed to delete place.");
    } else {
      console.log(deletedPlace);
      res.json(deletedPlace);
    }
  });
});

app.put('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Failed to update order status: ', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});








app.put('/orders/:orderId/markDelivered', (req, res) => {
  const orderId = req.params.orderId;

  // Find the order in the database by its ID
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Update the order status to 'Delivered'
      order.status = 'Delivered';

      // Save the updated order
      return order.save();
    })
    .then(() => {
      res.status(200).json({ message: 'Order marked as delivered' });
    })
    .catch((error) => {
      console.error('Failed to mark order as delivered: ', error);
      res.status(500).json({ error: 'Failed to mark order as delivered' });
    });
});

app.listen(4000);
