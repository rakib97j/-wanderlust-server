const express = require('express');
const dontenv = require('dotenv');
const cors = require("cors")
const { MongoClient, ServerApiVersion } = require("mongodb");
dontenv.config()

const uri = process.env.MONGODB_URI; ;
  


const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json())


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(" Connected ");



    const db = client.db("wanderlust");
    const destinationCollection =db.collection("destinations");

    app.get("/destination" , async (req ,res) =>{
      const result = await destinationCollection.find().toArray();
      res.json(result)
    })
 
    app.post("/destination" , async (req ,res) => {
      const destinationData = req.body;

      console.log(destinationData);

      const result = await destinationCollection.insertOne(destinationData);

      res.json(result);
    })
 






  } finally{
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
