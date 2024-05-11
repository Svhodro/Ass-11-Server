const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// middleware
app.use(cors());
app.use(express.json());
const corsConfig = {
  origin: "",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@ass-11.c2lx29d.mongodb.net/?retryWrites=true&w=majority&appName=Ass-11`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const date = client.db("Alldata").collection("AllBook");
    const borrowedbookadd = client.db("Alldata").collection("borrowedbook");

    app.get("/", (req, res) => {
      res.send("doctor is running");
    });

    app.get("/book", async (req, res) => {
      const arraydata = date.find();
      const data = await arraydata.toArray();      
      res.send(data);
    });

    app.post("/addborrow", async (req, res) => {
      const bookdata = req.body;
      const result = await borrowedbookadd.insertOne(bookdata);
    });
    app.put("/borrowbook/:id", async (req, res) => {
      const postId = req.params.id;
      const updateDetails = req.body;
      ;
      // Assuming the request body contains the
      console.log(postId)
      try {
        const database = client.db("Alldata");
        const books = database.collection("AllBook");
        // Create a filter for movies with the title "Random Harvest"
        const filter = { _id:new ObjectId(postId) };
              /* Set the upsert option to insert a document if no documents match
          the filter */
        const options = { upsert: true };
        // Specify the update to set a value for the plot field
        const updateDoc = {
          $set: {
            quantity: updateDetails.quantity,
          },
        };

        const result = await books.updateOne(filter, updateDoc, options);
      } catch (error) {
        console.log(error)
      }
    });

    app.get("/borrow", async (req, res) => {
      const arraydata = borrowedbookadd.find();
      const data = await arraydata.toArray();    
      res.send(data);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Car Doctor Server is running on port ${port}`);
});
