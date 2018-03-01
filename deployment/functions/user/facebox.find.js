const request = require('request');
const faceboxURL = process.env.FACEBOX_URL



module.exports = {
    findUser:  findUser = function(req, res) {
        console.log("Find User")
        var options = {
            uri: faceboxURL + '/facebox/check',
            method: 'POST',
            json: {
            "base64": req.body.image,
            }
        };

        console.log(JSON.stringify(options))
        
        request(options, function (error, response, body) {
            console.log(body)
            if (!error && response.statusCode == 200) {
                if(body.success == true && body.facesCount > 0 && body.faces[0].matched == true){
                    res.status(200).send(JSON.stringify({ userID: body.faces[0].name }))
                } else {
                    res.status(404).send(JSON.stringify({message: "User not found"}))
                }            
            } else {
                console.log(JSON.stringify(error))
                res.status(500).send(JSON.stringify({ message: "Something went wrong" }))
            }
        });

    }
}
