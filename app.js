

const PrettyError = require('pretty-error');


const rfr = require('rfr');
const express = require('express');
const http = require('http');
const cors =  require('cors');
const bodyParser = require('body-parser');

// const utils = rfr('/shared/utils');
const routes = rfr('/routes');
//const notificationModel = rfr('/models/admin/notification');
const config = require('./server/config/config.js');
rfr('/db/index');


// Initialize pretty-error
const pe = new PrettyError();
pe.start();



const app = express();

// Set port for heroku deployment
app.set('port', config.port);

app.use(bodyParser.urlencoded({
  extended: true
}));



  app.use(cors({origin:'*'}));
  app.use(bodyParser.json({limit: '500mb'})); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" })); // support encoded bodies

  //To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    //and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

 
app.get("/hello",(req, res)=>{
res.send("Hello")
})

  const server = http.createServer(app);
  console.log("STARTING-------------------------------------")
  console.log(process.env.CLEARDB_AMBER_URL)
  server.listen(app.get('port'), function () {
    console.log('App is listening on port ' + config.port + '! Visit localhost:' + config.port + ' in your browser.');
  //  utils.log('Server started successfully on port -->', config.port);
   routes.bindAllRequests(app);
   app.use(rfr('/universalRoute.js'));
   // notificationModel.reshceduleNotification();
  });


  process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION, APP SHUTTING NOW!!");
    console.log(err);
    process.exit(1);
  });

