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
  text: `select * from blog.posts
         order by blog.posts.date_posted desc;`
  })
  return result.rows;
};

export { postToDB, getFromDB };