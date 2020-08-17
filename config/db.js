const mongoose = require('mongoose');

const connection = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://Nanjs:Nanjs@cluster0.xtsv6.gcp.mongodb.net/onlineSchoolChat?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        // user: "nan@js",
        // pass: "db@nan@news"
      }
    );
    console.log('connected to mongodb');
  } catch (err) {
    console.log(err);
  }
};
module.exports = connection;
