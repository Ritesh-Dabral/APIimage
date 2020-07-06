var  path = require('path');

function setImage(data){
    var image = {
        url: data.path,
        name: data.originalname,
        type: data.mimetype,
        metaData:{
          Size: data.size,
          encoding: data.encoding,
          extType:path.extname(data.originalname),
        }

      }
      image.name = (image.name.replace(image.metaData.extType,'')).toLowerCase();
    return image;
}

module.exports = {
    setImage
}