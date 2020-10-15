require('dotenv/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const ApiRouter = require('./routes/Api.js');
const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);
const PORT = process.env.PORT; //aka BACK_PORT in frontend 


const fileUpload = require('./node_modules/express-fileupload/lib/index');

app.use(cors());
app.use(bodyParser.json());

//DB connection
mongoose.connect(MONGO_URI, {useNewUrlParser: true})
.then(()=>{
    const connection = mongoose.connection;
    connection.once('open', function(){
        console.log("MongoDB connection established successfully.");
        })
    }
).catch((e)=> {
    console.log("Could not connect to MongoDB.")
})


app.use(fileUpload());
app.use('/molten', ApiRouter)


app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
