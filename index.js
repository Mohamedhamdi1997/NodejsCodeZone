const http = require("node:http");
const fs = require('fs');

const homePage = fs.readFileSync('./views/index.html', 'utf-8');

const server = http.createServer((req, res) => {
    if(req.url == '/'){
        res.write(homePage);
    } else if(req.url == '/About') {
        res.write("About page");
    } else {
        res.write("Not found page");
    }

    res.end();
    
})

server.listen(3001, () => {
    console.log("Listening on port 3001")
})