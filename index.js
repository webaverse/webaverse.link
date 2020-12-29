#!/bin/bash

const fs = require('fs');
const http = require('http');
const express = require('express');

const app = express();
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});
app.use(express.static(__dirname));

http.createServer(app)
  .listen(3000);

console.log(`http://127.0.0.1:3000`);
