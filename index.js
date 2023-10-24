const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const port = process.env.PORT || 8000

// Middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@main.yolij.mongodb.net/?retryWrites=true&w=majority`
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
async function run() {
  try {
    const database = client.db('memory-book')
    const memoryCollection = database.collection('memories')

    // Get all memories
    app.get('/memories', async (req, res) => {
      const result = await memoryCollection.find().toArray()
      res.send(result)
    })

    // Save a memory
    app.post('/add-memory', async (req, res) => {
      const memory = req.body
      console.log(memory)
      const result = await memoryCollection.insertOne(memory)
      console.log(result)
      res.send(result)
    })

    // Delete a memory
    app.delete('/delete-memory/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await memoryCollection.deleteOne(query)
      console.log(result)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir)

app.get('/', (req, res) => res.send(`Welcome to memoryBook server`))
app.listen(port, () => console.log(`Server running at port: ${port}`))
