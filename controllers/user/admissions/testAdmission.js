const express = require('express')

const multer = require('multer')

const pdf = require('html-pdf')

const fs = require('fs')

const path = require('path')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  },
});

var upload = multer({ storage: storage }).single('file');

const app = express()

app.use(express.static('public/uploads'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
    return
})

app.post('/htmltopdf', (req, res) => {

    output = Date.now() + "output.pdf"
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(req.file.path)

            var html = fs.readFileSync(req.file.path, "utf8");
            var options = { format: "Letter" };

            pdf
              .create(html, options)
              .toFile(output, function (err, response) {
                if (err) return console.log(err);
                  console.log(response.filename); // { filename: '/app/businesscard.pdf' }
                  
                  return res.download(response.filename, () => {
                      
                  })
              });
        }
    })
})

