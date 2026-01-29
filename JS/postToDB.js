import pg from 'pg';

const date = new Date();
let dd = date.getDate();
let mm = date.getMonth() + 1;
let yy = date.getFullYear().toString().slice(-2);

let formattedDate = `${dd}-${mm}-${yy}`;

const pool = new pg.Pool(
    {    
        host: "localhost",
        port: 5432,
        user: "hroach",
        password: "password",
        database: "postgres"
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

export { postToDB };