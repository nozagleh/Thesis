import Express from 'express';
import GraphHTTP from 'express-graphql';
import Schema from './schema';
import Path from 'path';
import mysql from 'mysql';
import rest from './REST';

const APP_PORT = 4000;

const app = Express();

const ROUTER = Express.Router();

function REST(){
  var self = this;
  self.connectMysql();
};

REST.prototype.connectMysql = function() {
  var self = this;
  var pool = mysql.createPool({
    connectionLimit : 100,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'thesis-db',
    debug : false
  });
  pool.getConnection(function(err,connection){
    if(err) {
      exit(1);
    } else {
      connection.connect();
      var rest_router = new rest(ROUTER,connection);
    }
  });
}

new REST();

app.use(Express.static(__dirname));

/*app.use('/react', function (req, res){
  res.sendFile(Path.join(__dirname+'/react.html'));
});*/

app.use('/pilot', function (req, res){
  res.sendFile(Path.join(__dirname+'/pilot_test.html'));
});

app.use('/rest', ROUTER);

app.use('/graphql', GraphHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));

app.listen(APP_PORT, ()=>{
  console.log(`App listening on port ${APP_PORT}`);
});

/*var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');*/
