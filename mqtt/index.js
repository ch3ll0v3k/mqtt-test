const mqtt = require('mqtt');

module.exports = async ( App, params={} )=>{

  try{

    const { port, option } = App.config.mqtt;

    const mQtt = mqtt.connect(config.mqtt.host, config.mqtt.option);
    mQtt.on("connect", () => {
      console.log(` MQTT: connected`);

      mQtt.subscribe('event-0', function (err) {
        if (!err) 
          mQtt.publish('event-0', 'Hello mqtt');
      });

      mQtt.subscribe('event-1', function (err) {
        if (!err) 
          mQtt.publish('event-1', 'Hello mqtt');
      });

      mQtt.subscribe('event-2', function (err) {
        if (!err) 
          mQtt.publish('event-2', 'Hello mqtt');
      });

    });

    mQtt.on('message', async (topic, message, packet) => {
        try {
            console.log("Received '" + message + "' on '" + topic + "'");

            const split_topic = topic.split('/');
            const user = split_topic[0];
            const device = split_topic[1];
            const action = split_topic[2];
            const action_type = split_topic[3];
            const mess = parseFloat(message.toString());

            console.json({user, device, action, action_type, mess});

            const db = App.DB.db( App.config.mongodb.dbName );
            const coll_device = db.collection("device");
            const coll_status_device = db.collection("status_device");
            const result = await coll_device.findOne({"uid": device});
            //console.json(result);

            if(!result) throw new Error('NULL result');

            switch(action) {
                case 'temp':
                    if(action_type != 'celsius') throw new Error('no celsius');

                    console.log("TEMP");
                    const temp_res = await coll_status_device.updateMany(
                        {
                            "id_device": ObjectID(result._id),
                            "properties.state.instance": "temperature",
                        }, //поиск   
                        { $set: {"properties.$.state.value": mess} }, //что заменить
                        { upsert: false } //странная настройка
                    );
                    console.log("Готово");
                    break;
                case 'door':
                    console.log("DOOR");
                    break;
                case 'humidity':
                    if(action_type != 'percent') throw new Error('no percent');

                    console.log("HUMIDITY");
                    const hum_res = await coll_status_device.updateMany(
                        {
                            "id_device": ObjectID(result._id),
                            "properties.state.instance": "humidity",
                        }, //поиск   
                        { $set: {"properties.$.state.value": mess} }, //что заменить
                        { upsert: false } //странная настройка
                    );
                    console.log("Готово");
                    break;
                case 'status':
                    console.log("PING");
                    break;
                default:
                    console.log("ERR");
                    throw new Error('err default');
            }
        } catch (e) {
            console.log(` error: [mqtt]: ${e.message} `);
        }
    });

    //client.subscribe('test/lamp');
    mQtt.subscribe('#');

    return mQtt;

  }catch(e){
    console.error(` MQTT: ${e.message}`);
    return false;
  }

}
