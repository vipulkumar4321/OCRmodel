const express = require("express"),
      bodyParser = require("body-parser"),
      expressFileUpload = require("express-fileupload"),
      imageToBase64 = require("image-to-base64"),
      axios = require("axios"),
      app = express();

      var count = 0;

    app.use(
    bodyParser.urlencoded({
        extended: true,
    })
    );
    app.use(expressFileUpload());

    app.get("/", function(req, res) {
        res.send("Hello World");
    });
    
    app.get("/ocrmodel", function(req, res) {
        res.render("ocr.ejs");
    });

    app.post("/ocrmodel", function(req, res) {
        var image;
        var uploadPath;

        image = req.files.imginput;
        // console.log(image);
        count++;
        uploadPath = __dirname + '/uploads/' + count + image.name;

        image.mv(uploadPath, function(err) {
            if (err) {
                return res.status(500).send(err);
            }

            // console.log('File uploaded to ' + uploadPath);
        });

        function imgProcess() {
            // console.log(uploadPath);
            imageToBase64(uploadPath) // you can also to use url
            .then(
                (base64) => {
                    // console.log("ocr model");
                    // console.log(base64); //cGF0aC90by9maWxlLmpwZw==
                    axios
                        .post("http://13.58.246.125:8080/OCRThis", {
                            imgByte: base64,
                        })
                        .then(function (response) {
                            // console.log(response);
                            res.redirect("/ocrresult" + "?data=" + response["imgData"]);
                            console.log("after redirect ");
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                })
                .catch(
                    (error) => {
                        console.log(error); //Exepection error....
                    }
                )
        }
        setTimeout(imgProcess, 5000);
    });
      
    app.get("/ocrresult", function(req, res) {
        console.log("result!!!");
        res.render("ocrresult.ejs", {data: req.query.data});
    });
      
    app.listen(9002, function() {
        console.log("server is started!!");
    })
