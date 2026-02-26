import pg from 'pg';
import creds from "../JSON/PGcreds.json" with { type:"json"};

const date = new Date();
let dd = date.getDate();
let mm = date.getMonth() + 1;
let yy = date.getFullYear().toString().slice(-2);

let formattedDate = `${dd}-${mm}-${yy}`;

const pool = new pg.Pool(
    {    
        host: creds.host,
        port: creds.port,
        user: creds.user,
        password: creds.password,
        database: creds.database
    }
);


async function postToDB(text,img='null',date=formattedDate){

const client = await pool.connect();
await client.query(
    `INSERT INTO blog.posts (body_text, image, date_posted)
    VALUES ($1, $2, $3)`,
  [
    text,
    img,
    date
  ]
);
}

async function getFromDB(){
  const client = await pool.connect();
  const result = await client.query({
  rowMode: 'array',
  text: `SELECT * FROM blog.posts
         ORDER BY blog.posts.date_posted DESC;`
  })
  return result.rows;
};

async function initDB() {
    const client = await pool.connect();
    try {
        await client.query(`CREATE SCHEMA IF NOT EXISTS blog`);

        await client.query(
            `CREATE TABLE IF NOT EXISTS blog.posts (
                id SERIAL PRIMARY KEY,
                body_text TEXT NOT NULL,
                image BYTEA,
                date_posted DATE
            )`
        );
      }
      finally {
        client.release();
    }
  }

export { postToDB, getFromDB, initDB };
