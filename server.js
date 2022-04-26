const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Redis = require("redis");

const DEFAULT_EXPIRATION = 3600;

const redisClient = Redis.createClient({
  url: "redis://redis-14437.c62.us-east-1-4.ec2.cloud.redislabs.com:14437",
  password: "fofsW2tllOxblIdFsHylohfBSagsYA2y",
  name: "redis-db-1",
});

(async () => {
  await redisClient.connect();
})();

const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  res.send("DEFAULT ROUTE!");
});

app.get("/photos", async (req, res) => {
  console.log("* /photos !");
  const albumId = req.query.albumId;
  
  // check for cached results 
  const cachedData = await redisClient.GET(`photos?albumId=${albumId}`).catch((error) => {
    console.error("REDDIS ERROR: ", error);
    return res.status(500).send("REDIS ERROR");
  })
  if (cachedData != null) {
    console.log("REDIS CACHE FOUND!");
    // console.log("CACHE: ", JSON.parse(cachedData));
    return res.json(JSON.parse(cachedData));
  }
  
  // if no cache, fresh request 
  const { data } = await axios.get(
    "https://jsonplaceholder.typicode.com/photos",
    { params: { albumId } }
  );
  
  // cache results from fresh request 
  console.log("Caching Fresh Result");
  // console.log("NEW CACHE: ", data);
  redisClient.SETEX(`photos?albumId=${albumId}`, DEFAULT_EXPIRATION, JSON.stringify(data))

  res.json(data);
});

app.get("/photos/:id", async (req, res) => {
  console.log("* /photos/:id !")
  
  const photo = await getOrSetCache(`photos:${req.params.id}`, async () => {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
    );
    return data; 
  });
  
  res.json(photo)
});

function getOrSetCache(key, callback) {
  return new Promise((resolve, reject) => {
    redisClient.GET(key)
      .then(async (data) => {
        if (data != null) return resolve(JSON.parse(data));
        const freshData = await callback();
        redisClient.SETEX(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
        resolve(freshData);
      })
      .catch(error => {
        return reject(error);
      })
  }) 
}

app.listen(3000);

