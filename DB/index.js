const { MongoClient, ObjectID } = require('mongodb');
//const ObjectId = require('mongodb').ObjectID;

module.exports = async ( App, params={} )=>{

  try{

    const { username, password, host, port, dbName } = App.config.mongodb;

    const urlMongo = `mongodb://${username}:${password}@${host}:${port}/${dbName}`;
    const mongoDB = new MongoClient(urlMongo, {
      useUnifiedTopology: true,
      ...params,
    });

    console.log(` MongoClient: inited`);
    return mongoDB;

  }catch(e){
    console.error(` MongoClient: ${e.message}`);
    return false;
  }

}



