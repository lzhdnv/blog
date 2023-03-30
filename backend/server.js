const express = require('express')
const app = express()
const jsonParser = express.json();
// const cors = require('cors');
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "markovrv.ru",
    user: "blog",
    database: "blog",
    password: "vYVLns64CjeQHUX8"
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


app.get('/api/articles', function (req, res) {
    connection.query("SELECT * FROM articles",
        function (err, results) {
            if (err) {
                console.log(err);
                res.send([]);
            }
            else res.send(results);
        });
})

app.put('/api/articles', jsonParser, function (req, res) {

    const article = [req.body.name, req.body.content];
    const sql = "INSERT INTO articles (name, content) VALUES(?, ?)";

    connection.query(sql, article, function (err, results) {
        if (err) res.send("ERROR");
        else res.send(results);
    });
})

app.post('/api/article', jsonParser, function (req, res) {
    const article = [req.body.name, req.body.content, req.body.id];
    const sql = "UPDATE articles SET name = ?, content = ? WHERE id = ?;";

    connection.query(sql, article, function (err) {
        if (err) res.send("ERROR");
        else res.send("OK");
    });
})

app.delete('/api/article', function (req, res) {
    let id = req.query.id;
    connection.query("DELETE FROM articles WHERE id="+ Number(id),
        function (err) {
            if (err) {
                console.log(err);
                res.send("error");
            }
            else res.send("OK");
        });
})


app.listen(3000, () => { console.log('http://localhost:3000') })