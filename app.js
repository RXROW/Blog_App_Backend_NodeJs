const express = require("express");
const connectionToDB = require("./config/connectToDB");
const dotenv = require('dotenv');  // Import dotenv module
const { errorHandler ,notFoundErrorHandler } = require("./middlewares/erorrHandle");
const cors = require('cors');
const xss = require('xss-clean');
 
 


dotenv.config();  // Call dotenv.config() to load environment variables



// Connection To MongoDB
connectionToDB();
const app = express();
app.use(express.json());

// xss Attack 
// XSS protection middleware
app.use(xss())

 

 

// Cors Plicy
app.use(cors({
  origin:"http://localhost:3000"
}))

// Router

 app.use("/api/auth", require("./routes/authRoute"));
 app.use("/api/users", require("./routes/usersRoute"));
 app.use("/api/posts", require("./routes/postsRoute"));
 app.use("/api/comments", require("./routes/commentsRoute"));
 app.use("/api/categories", require("./routes/categoriesRoute"));

// Erorr Handler Middleware
app.use(notFoundErrorHandler) 

app.use( errorHandler) 

// Connection To MongoDB
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server Is Running In ${PORT}`));
