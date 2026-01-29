import express, { json, text } from 'express';
import multer from 'multer';
import { postToDB } from './postToDB.js';

// FIND OUT HOW TO CHANGE THE OWNERSHIP OF THE POSTIMG FILE SO THAT POSTGRES WILL UPLOAD IT
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


app.get('/', (req, res) => {
  res.send('get a clue, world')
  console.log('get request recieved');
})

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