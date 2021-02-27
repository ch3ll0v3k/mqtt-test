const logger = require('mii-logger.js');
const config = require('./config');

const DB = require('./DB');
const mqtt = require('./mqtt');
const routes = require('./routes');

module.exports = App = class App{

  constructor( params={} ){

    this.config = {
      ...( params.config || {} ),
      ...config,
    };

    this.DB = null;
    this.mqtt = null;
    this.app = null;
    this._init();
  }

  async _init(){

    this.app = express();
    this.DB = await DB( this, {} );
    this.mqtt = await mqtt( this, {} );
    await routes( this, {} );

  }

}