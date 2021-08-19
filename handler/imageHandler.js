const fs = require('fs');
const jimp = require("jimp");

exports.toImgString = async (img) => {
    //conpress image a bit before converting to string;
    let cmpImg = await jimp.read(img, (err, res) => {
        if(err) throw new Error(err);
        res.quality(60).write(`${Date.now()}-compressed-${img}`)
        .then(() => console.log("Image compressed successfully"));
    })
    const imgString = fs.readFileSync(cmpImg, "base64");
    return imgString;
} 

exports.toImage = async (baseStr, imgName) => {
    let buffer = Buffer.from(baseStr, "base64");
    let img = fs.writeFileSync(imgName, buffer);
    return img;
}