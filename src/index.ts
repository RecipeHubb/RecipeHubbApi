

import express from 'express'
let app = express();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const port = process.env.PORT || 3000;
const routes = require('./routes')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


// Middleware
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

// Only this website can hit our api
const whitelist = ['http://localhost:8080','http://localhost:8081', 'https://recipehubbapi.herokuapp.com', 'https://recipe-hubb-client.vercel.app', 'https://recipe-hubb-client-graciasclaude.vercel.app']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))
app.use( function(req, res, next) {

  if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
    return res.sendStatus(204);
  }

  return next();

});

mongoose.connect(
  process.env.MONGO_API_KEY,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
     
  }
);

app.get('/', (req,res) => {
  res.send("Unprotected Recipe Chicken Heart Beets")
})


app.listen(port, () => {
  console.log(`Server running locally at http://localhost:${port}`)
});

app = routes.register(app)
// Central error handler — catches anything thrown by async route handlers
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' })
})


