var express = require('express'),
    app     = express(),
    bodyParser = require('body-parser'),
    upload = require('./multerData'),
    db_response = require('./mongoConnect'),
    imageRead = require('./readImg');

// INITIAL SETTINGS
app.use(express.static('public'))
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));


PORT=  process.env.PORT || 8085;

//ROUTES
app.get("/:img/:lim/search",(req,res)=>{
    var imgName = (req.params.img).toLowerCase();
    var lim = Number(req.params.lim);
    
    db_response.get().collection("images").find({"name":imgName}).limit(lim).toArray(function(err,result){
        if(err)
            throw err;
        console.log(result);
        res.render('result',{resultRec:result, imgName:imgName});
    });

});

app.post("/img",(req,res)=>{
    res.redirect('/'+req.body.imgName+'/'+req.body.lim+'/search')
});

app.post('/upload', upload.single('imgURL'), function(req, res, next){

    if (req.file) {

        image = imageRead.setImage(req.file);

        if(image.type==="image/jpeg" || image.type==="image/gif" || image.type==="image/png" || image.type==="image/jpg"){

            db_response.get().collection("images").insertOne(image,(err,res)=>{
                if(err)
                    throw err;
                console.log("insert successful");
            });
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
    db_response.connect(()=>console.log("Successfully connected to DB"));
});