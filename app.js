const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(cors());

// mySQL
const pool = mysql.createPool({
    connectionLimit: 10,
    host: `localhost`,
    user: "root",
    password: "",
    database: "nodejs_collections"
}) 

// Get all beers

app.get(`/`, (req, res) => {
    pool.getConnection((err, connection) => {
        console.log(err);
        if(err) throw err;
        console.log(`connected as id ${connection.threadId}`)

        connection.query("SELECT * from goods", (err, rows) => {
            connection.release()

            if(!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
})
//get by ID
app.get(`/:id`, (req, res) => {

    pool.getConnection((err, connection) => {
        console.log(err);
        if(err) throw err;
        console.log(`connected as id ${connection.threadId}`)

        connection.query("SELECT * from goods WHERE id = ?", [req.params.id], (err, rows) => {
            connection.release()

            if(!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        });
    });
})

//delete by ID
app.delete(`/:id`, (req, res) => {

    pool.getConnection((err, connection) => {
        console.log(err);
        if(err) throw err;
        console.log(`connected as id ${connection.threadId}`)
        connection.query("DELETE from goods WHERE id = ?", [req.params.id], (err, rows) => {
            connection.release()

            if(!err) {
                res.send("Good is deleted");
            } else {
                console.log(err);
            }
        });
    });
})
//add a good
app.post(`/`, (req, res) => {

    pool.getConnection((err, connection) => {
        console.log(err);
        if(err) throw err;
        console.log(`connected as id ${connection.threadId}`)
        console.log(req.body, ">>>> body");
        const param = req.body;

        connection.query("INSERT INTO goods SET ?", param, (err, rows) => {
            connection.release()

            if(!err) {
                res.send("Good is added");
            } else {
                console.log(err);
            }
        });

    });
})
//update goods
app.put(`/`, (req, res) => {

    pool.getConnection((err, connection) => {
        console.log(err);
        if(err) throw err;
        console.log(`connected as id ${connection.threadId}`)

        const {id, name, categorie, price, rating} = req.body;
        console.log(id, name, categorie, price, rating, req.body);
        connection.query("UPDATE goods SET name = ?, categorie = ?, price = ?, rating = ?, description = ? WHERE id = ?", [name, categorie, price, rating, id], (err, rows) => {
            connection.release()

            if(!err) {
                res.send("Good is updated");
            } else {
                console.log(err);
            }
        });

        console.log(req.body);
    });
})

// listen 
app.listen(PORT, () => {
    console.log(`listen on port: ${PORT}...`)
})
