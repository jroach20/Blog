import pg from 'pg';

const date = new Date();
let dd = date.getDate();
let mm = date.getMonth() + 1;
let yy = date.getFullYear().toString().slice(-2);

let formattedDate = `${dd}-${mm}-${yy}`;

function postToDB(text,image='null',date=formattedDate){

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
