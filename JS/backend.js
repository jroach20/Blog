import { createServer } from 'http';
import express, { json } from 'express';
import pg from 'pg';
import multer from 'multer';

const multer  = multer();
const app = express();
app.use(json());

const date = new Date();
let dd = date.getDay();
let mm = date.getMonth();
let yy = date.getFullYear().toString().substring(2);


function postToDB(text,image='null',date=`${dd}-${mm}-${yy}`){

const client = new pg.Client({
    host: "localhost",
    port: 5432,
    user: "hroach",
    password: "password",
    database: "postgres"
});

client.connect((err) =>{
    if(err) throw err;
    const q = `INSERT INTO blog.posts (body_text, image, date_posted) VALUES ('${text}', pg_read_binary_file(${image}), '${date}');`
    console.log(q);
    client.query(q, (error, results) => {
        if(error) throw error;

        console.log(results.rows)

    })
})
}

const port = 3000;

createServer((req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*', /* @dev First, read about security */
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000, // 30 days
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
    /** add other headers as per requirement */
  };

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  //POST
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const text = (data.text || '').trim();

        if (!text) {
          res.writeHead(400, headers);
          res.end(JSON.stringify({ error: 'Text field is required' }));
          return;
        }
        
        //console.log("Received post: " + text);
        postToDB(text);
        return;
      }

       catch (err) {
        console.error('❌ Invalid JSON:', err);
        res.writeHead(400, headers);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  //GET
  res.writeHead(200, headers);
  res.end(JSON.stringify({ message: 'Send a POST with JSON {"text":"..."}' }));
}).listen(port);

console.log(`Yippeeee!!! Backend running at http://127.0.0.1:${port}`);