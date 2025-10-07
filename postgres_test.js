const pg = require("pg");

const client = new pg.Client({
    host: "localhost",
    port: 5432,
    user: "hroach",
    password: "password",
    database: "postgres"
});

client.connect((err) =>{
    if(err) throw err;

    client.query("insert into test.table (\"column1\", \"column2\", \"column3\") values ('j', 'k', 'l');", (error, results) => {
        if(error) throw error;

        console.log(results.rows)

    })
})
