var mongo   = require('mongodb'),
    warnings = {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology:true,
    },
    mongoDB;

const URI = "mongodb+srv://riteshD:1pieceritZ@@cluster0.avrjs.azure.mongodb.net/myDBS?retryWrites=true&w=majority";

function connect(cb){
    mongo.connect(URI,warnings, function(err,db_response){
        if(err){
            console.log("Couldn't connect\n",err);
        }
        else {
            mongoDB =  db_response.db("myDBS");
            //execute cb func.
            cb();
        }
    });
    
};

function get(imgName,lim){
    return mongoDB;
}


function close(){
    console.log("Disconnecting");
    mongoDB.close();
}

module.exports = {
    connect,
    get,
    close,
}