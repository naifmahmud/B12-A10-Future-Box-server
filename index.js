require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const express= require("express");
const cors= require("cors");
const port= process.env.PORT || 3000;


const app=express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.db_username}:${process.env.db_password}@cluster0.4guptnm.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/',(req,res)=>{
    res.send("My server is running")
})


async function run(){
    try{
        await client.connect();
        const db = client.db("food-lover-DB");
        const reviewCollection = db.collection('allReviewCollection');


        app.get('/allReviews',async(req,res)=>{
            const result= await reviewCollection.find().toArray();
            res.send(result);
                })

                app.get('/topRating',async(req,res)=>{
                    const result= await reviewCollection.find().sort({rating:-1}).limit(6).toArray();
                    res.send(result)
                })


        await client.db("admin").command({ping:1});
            console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    finally{

    }
}
run().catch(console.dir);




app.listen(port,()=>{
    console.log(`my server is running on PORT: ${port}`);
    
})