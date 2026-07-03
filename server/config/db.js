const mongoose = require("mongoose");
//using mongoose
const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/spend_smart";
    
    // Mask password in logs if database URI has it
    const logUri = connUri.replace(/:([^@]+)@/, ":****@");
    console.log(`Connecting to MongoDB at: ${logUri}`);
    
    await mongoose.connect(connUri);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
