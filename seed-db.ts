import data from "./mcmasteful-book-list.json"
import { client, collection } from "./src/mongo-client"

// Seeds database with data from the McMasterful Books list json file
const seed = async () => {
    await client.connect()
    for (let i = 0; i < data.length; i++) {
        const book = data[i]
        console.log(`Inserting book: ${book.name}`)
        await collection.insertOne(book)
    }
}

// Removes collections from the MongoDB database
const clearCollection = async () => {
    await client.connect()
    console.log(`Removing collection.`)
    await collection.deleteMany({})
}

// Clears and reseeds the data, effectively resetting the data
clearCollection()
seed()