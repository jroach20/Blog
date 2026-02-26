import express, { json, text } from 'express';
import multer from 'multer';
import { postToDB, getFromDB, initDB } from './pgClient.js';
import { Buffer } from 'node:buffer';

const app = express();
const port = '3000';

const storage = multer.memoryStorage({
  mimetype: 'image/png',
  size: 411336
});

const upload = multer({
                        storage: storage,
                        limits: {
                          fileSize: 5 * 1024 * 1024 // 5 MB
                          }
                        });


// CORS middleware
const allowCrossDomain = (req, res, next) => {
    /** add other headers as per requirement */
  res.header(      'Access-Control-Allow-Origin', '*');
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  res.header('Content-Type', 'application/json');
  next();
};

app.use(allowCrossDomain);
app.use(json( { limit: "5mb" } ));
app.use(express.urlencoded({ limit: "5mb", extended: true }));


app.get('/', async (req, res) => {
  try{
    const posts = await getFromDB();
    posts.forEach(row => {
  
    if (row[1]) {
      row[1] = Buffer.from(row[1]).toString("base64");
      }
      
    });

    res.json(posts)
  }
  
  catch (err) {
    console.error('Invalid JSON:', err);
    res.writeHead(400, headers);
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
  }

});

app.post('/', upload.single('img_upload'), function (req, res){
      try {
        const text = req.body.text;
        const img = req.file?.buffer ?? null;        
        postToDB(text,img);

        if (!text) {
          res.writeHead(400, headers);
          res.end(JSON.stringify({ error: 'Text field is required' }));
        }
      }
      
      catch (err) {
        console.error('Invalid JSON:', err);
        res.writeHead(400, headers);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
});

app.listen(port, function (){
  console.log("Server is running!!!!")
});

initDB();
