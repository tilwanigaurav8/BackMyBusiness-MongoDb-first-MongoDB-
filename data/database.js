const mongodb=require('mongodb');

const MongoClient=mongodb.MongoClient;
let database;

async function connect(){
    const client=await MongoClient.connect('mongodb://localhost:27017');
    database=client.db('note');
}

function getDb(){
    if(database){
        return database;
    }
    else{
        throw {message:'Database connection not established'};
    }
}

module.exports={
    connectToDatabase:connect,
    getDb:getDb
}