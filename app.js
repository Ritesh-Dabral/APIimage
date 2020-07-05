var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    mongo   = require('mongodb'),
    multer  = require('multer'),
    path = require('path');

// INITIAL SETTINGS
app.use(express.static('public'))
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

var warnings = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology:true,
}

var newStorage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'/uploads');
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
});
var upload = multer({storage:newStorage});

PORT=  process.env.PORT || 8085;

const URI = "mongodb+srv://riteshD:1pieceritZ@@cluster0.avrjs.azure.mongodb.net/myDBS?retryWrites=true&w=majority";

function dataUpload (image){
    mongo.connect(URI,warnings, function(err,db_response){
        if(err){
            console.log("Couldn't connect\n",err);
        }
        else {
            console.log('connected to Image DB');
            var dbObj = db_response.db("myDBS");
            dbObj.collection("images").insertOne(image,(err,res)=>{
                if(err)
                    throw err;
                console.log(JSON.stringify(res));
                db_response.close();
            });
        }
    });
}


//ROUTES
app.get("/:img/:lim/search",(req,res)=>{
    var imgName = req.params.img;
    var lim = Number(req.params.lim);
    
    console.log("getting data",lim);
    mongo.connect(URI,warnings, function(err,db_response){
        if(err){
            console.log("Couldn't connect\n",err);
        }
        else {
            console.log('connected to Image DB');
            var dbObj = db_response.db("myDBS");
            dbObj.collection("images").find({"name":imgName}).limit(lim).toArray(function(err,result){
                if(err)
                    throw err;
                console.log(result);
                db_response.close();
                res.render('result',{resultRec:result, imgName:imgName});
            });
        }
    });
});

app.post("/img",(req,res)=>{
    res.redirect('/'+req.body.imgName+'/'+req.body.lim+'/search')
});

app.post('/upload', upload.single('imgURL'), function(req, res, next){

    if (req.file) {
        var image = {
          url: req.file.path,
          name: req.file.originalname,
          type: req.file.mimetype,
          metaData:{
            Size: req.file.size,
            encoding: req.file.encoding,
            extType:path.extname(req.file.originalname),
          }

        }
        image.name = image.name.replace(image.metaData.extType,'');
        console.log(image);
        if(image.type==="image/jpeg" || image.type==="image/gif" || image.type==="image/png"){
            dataUpload(image);
        }            
        else
            res.send(`<h1 style="text-align:center;">Type Doesn't Match</h1><br><a href="/">Click to go back</a>`);
    }
    res.redirect('/');
});

app.get('/',(req,res)=>{
    res.render('index');
});


app.listen(PORT,()=>{
    console.log("SERVER STARTED");
});