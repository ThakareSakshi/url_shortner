import express from "express"; 
import fs from "node:fs";
import path from "node:path";
import { nanoid } from "nanoid";
import { fileURLToPath } from "node:url";

const app=express();



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isURLValid = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Request received on /",__dirname);
  res.sendFile(__dirname + "/index.html");
});

app.post("/url-shortner", (req, res) => {
  const longUrl = req.body.url;
  const shortUrl = nanoid(10);
  console.log(req);
  
 
  const fileResponse = fs.readFileSync(path.join(__dirname,"urlmap.json"));
  console.log(fileResponse);
  const fileData = JSON.parse(fileResponse.toString());
  console.log(fileData)
console.log("requiesddf",req)
  fileData[shortUrl] = longUrl;

  fs.writeFileSync(path.join(__dirname,"urlmap.json"), JSON.stringify(fileData));
  console.log(fileData)

  res.json({
    succes: true,
    url: `http://localhost:5000/${shortUrl}`,
    // https://url-shortner-0hcy.onrender.com
  });
});

app.get("/:shortUrl", (req, res) => {
  const fileResponse = fs.readFileSync(path.join(__dirname,"urlmap.json"));
  const fileData = JSON.parse(fileResponse.toString());
  const longUrl = fileData[req.params.shortUrl];
  console.log(longUrl);
  // If longurl doesn't exists show 404 with json
  res.redirect(longUrl);
});

app.listen(5000,()=>{
    console.log("app running");
})