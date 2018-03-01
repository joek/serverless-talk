const request = require('request');
const faceboxURL = process.env.FACEBOX_URL

module.exports = {
    trainUser:  trainUser = function(req, res) {
        var options = {
            uri: faceboxURL + '/facebox/teach',
            method: 'POST',
            json: {
            "base64": req.body.image,
            "name": req.body.userID,
            "id": req.body.userID
            }
        };

        
        request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("Image trained")
            res.status(200).send(JSON.stringify({ message: "Image Trained" }))
        } else {
            console.log(JSON.stringify(error))
            res.status(500).send(JSON.stringify({ message: "Something went wrong" }))
        }
        });
    }
}
