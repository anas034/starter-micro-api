const initialRoute = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end("<h1 style=text-align:center>Welcome to Student LMS API's 2022</h1>");
}



module.exports = initialRoute