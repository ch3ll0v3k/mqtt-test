"use strict"

const express = require('express');
const router = express.Router();

module.exports = async ( App )=>{

  router.use('/my/path/', async(req,res)=>{

    const db = App.DB.db( App.config.mongodb.dbName );
    const coll_device = db.collection("device");
    const coll_status_device = db.collection("status_device");
    const result = await coll_device.findOne({"uid": device});


    // и так далее .....


  });

}