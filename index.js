require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const favoriteCollection= db.collection('favorites');

        // All reviews
        app.get('/allReviews',async(req,res)=>{
            const result= await reviewCollection.find().sort({date: -1}).toArray();
            res.send(result);
                })

                // Top 6 Reviews
        app.get('/topRating',async(req,res)=>{
                    const result= await reviewCollection.find().sort({rating:-1}).limit(6).toArray();
                    res.send(result)
                })

            // find one by id
        app.get('/allReviews/:id',async(req,res)=>{
            const {id}= req.params;
            const query= {'_id': new ObjectId(id)}
            const result= await reviewCollection.findOne(query)

            res.send({
                success:true,
                result
            })
        })

        // my reviews
        app.get('/myReview',async(req,res)=>{

            const email= req.query.email;
            const result = await reviewCollection.find({user_email:email}).toArray();
            res.send(result)

        })

        // Edit Review
        app.patch('/allReviews/:id',async(req,res)=>{
            const id= req.params.id;
            const editData= req.body;
            const query= {'_id':new ObjectId(id)};
 
            const result= await reviewCollection.updateOne(query,{$set: editData});

            res.send({
                success:true,
                result
            })

        })
        

        // Insert data to mongodb
        app.post('/allReviews',async(req,res)=>{
            const data=req.body;
            console.log(data);
            const result= await reviewCollection.insertOne(data);
            res.send({
                success: true,
                result
            })

        }) 

        // Insert data to favorite
        app.post('/favorites',async(req,res)=>{
            const data= req.body;
            const result= await favoriteCollection.insertOne(data);
            res.send({
                success:true,
                result
            })
        })

        // get favorite data 
        app.get('/favorites',async(req,res)=>{
            const email= req.query.email;
            const result= await favoriteCollection.find({fav_user_email:email}).toArray();
            
            res.send(result);
        })


        // Delete Review
        app.delete('/allReviews/:id',async(req,res)=>{
            const {id}= req.params;
            const query= {'_id': new ObjectId(id)}

            const result= await reviewCollection.deleteOne(query);
            res.send({
                success:true,
                result
            })
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