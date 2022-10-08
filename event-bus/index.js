const express = require('express');
const {randomBytes} = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');


const app = express();
app.use(bodyParser.json());
app.use(cors());
const all_events = [];
app.post('/events',(req,res) => {
    const events = req.body;
    all_events.push(events);
    
    axios.post('http://comments-srv:4000/events', events).then(function (response) {}).catch(function (error) {console.log(error);});
    axios.post('http://posts-srv:3001/events', events).then(function (response) {}).catch(function (error) {console.log(error);});
    axios.post('http://query-srv:5001/events', events).then(function (response) {}).catch(function (error) {console.log(error);});
    axios.post('http://moderation-srv:5002/events', events).then(function (response) {}).catch(function (error) {console.log(error);});

    res.send({status: 'OK'})
});

app.get('/events',(req,res) => {
    res.send(all_events)
});


app.listen(5000,() => {
    console.log('listening on 5000');
});