const mongoose = require("mongoose");

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL_CLOUD, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
     
       

        });
        console.log("Connected To MongoDB ^_^");
    } catch (err) {
        console.error("Connection Failed To MongoDB!", err);
    }
};
