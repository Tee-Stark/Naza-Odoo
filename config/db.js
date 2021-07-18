//mongodb+srv://OdooAPI:<password>@cluster0.qytxo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const mongoose = require('mongoose');
require("dotenv").config();
//const { MONGOLAB_URI, API_PORT } = process.env;

mongoose.Promise = global.Promise;

try {
  mongoose .connect('mongodb+srv://OdooAPI:hS3ThkQJx6Vk7VH@cluster0.qytxo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
} catch (err) {
  throw err;
}

mongoose.connection.on("connected", () => {
  console.log(`connected to database Naza DB`);
});

// To Remove moongoose deprecation warnings
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);