const express = require('express');
const {randomBytes} = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts',(req,res) => {
    res.send(posts);
});

app.post('/posts/create',(req,res) => {
    const id = randomBytes(4).toString('hex');
    const {title} = req.body;
    posts[id] = {
        id,title
    }
    axios.post('http://bus-srv:5000/events',{
        type: 'create_post',
        data: {
            id,title
        }
    })
    .then(function (response) {
        //console.log(response);
    })
    .catch(function (error) {
        //console.log(error);
    });
    res.status(201).send(posts[id]);
});

app.post('/events',(req,res) => {
    console.log(`event type : ${req.body.type}`);
    res.send({})
});

app.listen(3001,() => {
    console.log('listening on 3001');
});