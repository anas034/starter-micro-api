const mongoose = require('mongoose')

// const mongoURI = 'mongodb://localhost:27017/Student-LMS-Database'
const mongoURI = process.env.MONGODB_URI




// const connectToMongo = () => {
//     mongoose.connect(mongoURI, ()=> {
//         console.log('connected to Mongoose Successfully..')
//     })
// }





const connectToMongo = () => {
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    mongoose.connection.on("connected", () => {
        console.log("mongo connected");
    });

    mongoose.connection.on("error", (err) => {
        console.log(err, "mongo error");
    });
}


module.exports = connectToMongo