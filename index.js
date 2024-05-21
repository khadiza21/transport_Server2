const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { ObjectId } = require("mongodb");

//middleware
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("sad application");
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@trassyes.mixiffr.mongodb.net/?retryWrites=true&w=majority&appName=trassyes`;

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
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });

    const reviewCollection = client.db("trasportsytem").collection("review");
    const categoriesCollection = client
      .db("trasportsytem")
      .collection("categories");
    const cartypesCollection = client
      .db("trasportsytem")
      .collection("cartypes");
    const userCollection = client.db("trasportsytem").collection("users");
    const busDriverCollection = client
      .db("trasportsytem")
      .collection("busdriveraccount");
    const carDriverCollection = client
      .db("trasportsytem")
      .collection("cardriveraccount");
    const aboutCart = client.db("trasportsytem").collection("aboutcart");
    const cardata = client.db("trasportsytem").collection("cardata");
    const ordersCollection = client
      .db("trasportsytem")
      .collection("orderhistory");

    //  for user and admin
    // crate user admin a
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    //find all users and admin
    app.get("/users", async (req, res) => {
      const userlists = await userCollection.find().toArray();
      res.send(userlists);
    });
    //find one user/admin
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: id };
      console.log(query);
      const result = await userCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
     
        const userId = req.params.id;
        const user = req.body;
        const filter = { _id: userId };
        const options = { upsert: true };
        const updateDoc = {
          $set: user,
        };
        console.log("udadate user", updateDoc);
        const result = await userCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        if (result.matchedCount === 0) {
          // If no documents matched the filter criteria
          return res.status(404).send({ message: "User not found" });
        }
        res.send({ message: "User updated successfully" });
     
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.deleteOne({ _id: id });
      if (result.deletedCount === 1) {
        res.json({ message: "User removed successfully" });
      } else {
        res.status(404).json({ error: "user not found" });
      }
    });
    app.patch("/users/:id", async (req, res) => {
      const { id } = req.params;
      const { verifiedStatus } = req.body;

        const result = await userCollection.updateOne(
          { _id: ObjectId(id) },
          { $set: { verifiedStatus } }
        );
    
        if (result.modifiedCount === 1) {
          res.status(200).json({ message: "User verified successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      
    });
   

    // busdriver
    app.post("/busdriveraccount", async (req, res) => {
      const busdriver = req.body;
      const query = { email: busdriver.email };
      const existingBusDriver = await busDriverCollection.findOne(query);
      if (existingBusDriver) {
        return res.send({ message: " already exists", insertedId: null });
      }
      const result = await busDriverCollection.insertOne(busdriver);
      res.send(result);
    });

    app.get("/busdriveraccount", async (req, res) => {
      const busdriverlist = await busDriverCollection.find().toArray();
      res.send(busdriverlist);
    });

    app.get("/busdriveraccount/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await busDriverCollection.findOne(query);
      res.send(result);
    });

    app.put("/busdriveraccount/:id", async (req, res) => {
      try {
        const busdriverId = req.params.id;
        const busdriver = req.body;
        const filter = { _id: busdriverId };
        const options = { upsert: true };
        const updateDoc = {
          $set: busdriver,
        };
        console.log("udadate driver bus", updateDoc);
        const result = await busDriverCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        if (result.matchedCount === 0) {
          // If no documents matched the filter criteria
          return res.status(404).send({ message: "User not found" });
        }
        res.send({ message: "bus driver updated successfully" });
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    app.delete("/busdriveraccount/:id", async (req, res) => {
      const id = req.params.id;
      const result = await busDriverCollection.deleteOne({ _id: id });
      if (result.deletedCount === 1) {
        res.json({ message: "Busdriver removed successfully" });
      } else {
        res.status(404).json({ error: "Busdriver not found" });
      }
    });

    app.patch("/busdriveraccount/:id", async (req, res) => {
      const { id } = req.params;
      const { verifiedStatus } = req.body;

        const result = await busDriverCollection.updateOne(
          { _id: ObjectId(id) },
          { $set: { verifiedStatus } }
        );
    
        if (result.modifiedCount === 1) {
          res.status(200).json({ message: "Busdriver verified successfully" });
        } else {
          res.status(404).json({ message: "Busdriver not found" });
        }
      
    });

    // cardriver
    app.post("/cardriveraccount", async (req, res) => {
      const cardriver = req.body;
      const query = { email: cardriver.email };
      const existingCarDriver = await carDriverCollection.findOne(query);
      if (existingCarDriver) {
        return res.send({ message: " already exists", insertedId: null });
      }
      const result = await carDriverCollection.insertOne(cardriver);
      res.send(result);
    });

    app.get("/cardriveraccount", async (req, res) => {
      const cardriverlist = await carDriverCollection.find().toArray();
      res.send(cardriverlist);
    });

    app.get("/cardriveraccount/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await carDriverCollection.findOne(query);
      res.send(result);
    });

    app.put("/cardriveraccount/:id", async (req, res) => {
      try {
        const cardriverId = req.params.id;
        const cardriver = req.body;
        const filter = { _id: cardriverId };
        const options = { upsert: true };
        const updateDoc = {
          $set: cardriver,
        };
        console.log("udadate driver bus", updateDoc);
        const result = await carDriverCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "User not found" });
        }
        res.send({ message: "bus driver updated successfully" });
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    app.delete("/cardriveraccount/:id", async (req, res) => {
      const id = req.params.id;
      const result = await carDriverCollection.deleteOne({ _id: id });
      if (result.deletedCount === 1) {
        res.json({ message: "Cardriver removed successfully" });
      } else {
        res.status(404).json({ error: "Cardriver not found" });
      }
    });

    app.patch("/cardriveraccount/:id", async (req, res) => {
      const { id } = req.params;
      const { verifiedStatus } = req.body;

        const result = await carDriverCollection.updateOne(
          { _id: ObjectId(id) },
          { $set: { verifiedStatus } }
        );
    
        if (result.modifiedCount === 1) {
          res.status(200).json({ message: "Cardriver verified successfully" });
        } else {
          res.status(404).json({ message: "Cardriver not found" });
        }
      
    });

    //orderhistory
    app.post("/orderhistory", async (req, res) => {
      try {
        const order = req.body;
        const result = await ordersCollection.insertOne(order);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error inserting order:", error);
        res.status(500).send({ error: "Failed to insert order" });
      }
    });

    app.get("/orderhistory", async (req, res) => {
      const orderresult = await ordersCollection.find().toArray();
      console.log("orderhistory ", orderresult);

      res.send(orderresult);
    });
    app.get("/orderhistory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await ordersCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.patch("/orderhistory/:id", async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;

      const result = await ordersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Order status updated successfully" });
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    });

    app.delete("/orderhistory/:id", async (req, res) => {
      const id = req.params.id;
      const result = await ordersCollection.deleteOne({
        _id: new ObjectId(id),
      });
      if (result.deletedCount === 1) {
        res.json({ message: "Order deleted successfully" });
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    });

    // car items types
    app.get("/cartypes", async (req, res) => {
      const cartypesresult = await cartypesCollection.find().toArray();
      res.send(cartypesresult);
    });

    // service category
    app.get("/categories", async (req, res) => {
      const catresult = await categoriesCollection.find().toArray();
      res.send(catresult);
    });

    // all reviews
    app.get("/review", async (req, res) => {
      const revresult = await reviewCollection.find().toArray();
      console.log("review ", revresult);
      const reversedReviews = revresult.reverse();
      res.send(reversedReviews);
    });

    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    // all cardata
    app.get("/cardata", async (req, res) => {
      const cardataresult = await cardata.find().toArray();
      console.log("cardata ", cardataresult);
      res.send(cardataresult);
    });

    app.post("/cardata", async (req, res) => {
      const { email, role, name, ...vehicleData } = req.body;

      try {
        const result = await cardata.insertOne({
          email,
          role,
          name,
          ...vehicleData,
        });
        res
          .status(201)
          .send({ message: "Form data saved successfully!", result });
      } catch (error) {
        res.status(500).send({ message: "Error saving form data", error });
      }
      console.log(res, "tst");
    });

    // about page data
    app.get("/aboutcart", async (req, res) => {
      const aboutc = await aboutCart.find().toArray();
      res.send(aboutc);
    });

    // console.log("connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`this is bk ${port}`);
});
