import express, { json } from 'express';
const app = express();
app.use(json());
import { Client } from "pg";

const date = new Date();
let dd = date.getDay();
let mm = date.getMonth();
let yy = date.getFullYear().toString().substring(2);

function postToDB(text,image=null,date=`${dd}-${mm}-${yy}`){

const client = new Client({
    host: "localhost",
    port: 5432,
    user: "hroach",
    password: "password",
    database: "postgres"
});

client.connect((err) =>{
    if(err) throw err;

    client.query(`INSERT INTO blog.posts (body_text, image, date_posted) VALUES (${text}, pg_read_binary_file(${image}), ${date});`, (error, results) => {
        if(error) throw error;

        console.log(results.rows)

    })
})
}