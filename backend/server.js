const express = require('express')
const app = express()
const jsonParser = express.json();
// const cors = require('cors');
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "markovrv.ru",
    user: "julia_usr",
    database: "julia",
    password: "qJT43Oll4jc1QClu"
});

app.use(express.static(__dirname + "/../frontend/dist"));

connection.connect(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

// app.use(cors());


app.get('/api/books', function (req, res) {
    connection.query("SELECT * FROM Библиотека",
        function (err, results) {
            if (err) {
                console.log(err);
                res.send([]);
            }
            else res.send(results);
        });
})

app.put('/api/books', jsonParser, function (req, res) {

    const book = [req.body.title, req.body.author,req.body.year,req.body.count ];
    const sql = "INSERT INTO Библиотека (title, author, year, count) VALUES(?, ?, ?, ?)";

    connection.query(sql, book, function (err, results) {
        if (err) res.send("ERROR");
        else res.send(results);
    });
})

app.post('/api/book', jsonParser, function (req, res) {
    const book = [req.body.title, req.body.author,req.body.year,req.body.count,req.body.idbook];
    const sql = "UPDATE Библиотека SET title = ?, author = ?, year = ?, count = ? WHERE idbook = ?;";

    connection.query(sql, book, function (err) {
        if (err) res.send("ERROR");
        else res.send("OK");
    });
})

app.listen(3000, () => { console.log('http://localhost:3000') })