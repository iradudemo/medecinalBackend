const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    mongoose.set("strictQuery", true);
    const conn = mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database error");
  }
};
module.exports = dbConnect;
