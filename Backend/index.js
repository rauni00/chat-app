import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import dotenv from 'dotenv';
import AllUsers from './models/AllUsers.js';
import cors from 'cors';
import mongoose from 'mongoose';
// const WebSocket = require('ws');
// const express = require('express');
// const http = require('http');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const router = express.Router();
const server = http.createServer(app);
const wss = new WebSocketServer({ server: server });
dotenv.config();
const PORT = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI;
app.use(router);
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    wss.clients.forEach(function each(client) {
      if (client !== ws) {
        client.send(message);
      }
    });
    ws.on('close', () => {
      // Remove the client's connection when they disconnect
    });
  });
});
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    server.listen(PORT, () =>
      console.log(` Database connected Listening on port :${PORT}`)
    );
  })
  .catch((e) => {
    console.log('Error - ', e);
  });

router.get('/allUsers', (req, res) => {
  AllUsers.find().then((users) => {
    res.json({ users: users, status: true });
  });
});
router.post('/addUsers', (req, res) => {
  if (req.body.name && req.body.isActive) {
    AllUsers.findOne({ name: req.body.name }).then((exit) => {
      if (exit) {
        res.status(400).json({ error: 'Name is Already!!', status: false });
      } else {
        const user = new AllUsers({
          name: req.body.name,
          isActive: req.body.isActive,
        });
        user.save().then((e) => {
          res.json({ e, status: true });
        });
      }
    });
  } else {
    res.status(400).json({ error: 'Name is required!!', status: false });
  }
});

router.post('/updateStatus/:id', (req, res) => {
  const { id } = req.params;
  if (id) {
    AllUsers.findOneAndUpdate(
      { _id: id },
      { $set: { isActive: req.body.isActive } },
      { new: true }
    )
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        res.status(400).json({ error: 'User not found', status: false });
      });
  }
});

router.get('/getStatus/:id', (req, res) => {
  const { id } = req.params;
  if (id) {
    AllUsers.findOne({ _id: id })
      .then((user) => {
        if (user) {
          res.json(user);
        }
      })
      .catch((err) => {
        res.status(400).json({ error: 'User not found', status: false });
      });
  }
});
