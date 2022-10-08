const express = require('express');
const {randomBytes} = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const comments = {};

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/posts/:id/comments',(req,res) => {
    const {id} = req.params;
    res.send(comments[id]);
});

app.post('/posts/:id/comments',(req,res) => {
    const {id} = req.params;
    const comment_id = randomBytes(4).toString('hex');
    const {content} = req.body;
    const all_comments = comments[id] || [];
    all_comments.push({
        comment_id,content,status:'pending'
    })
    axios.post('http://bus-srv:5000/events',{
        type: 'create_comment',
        data: {
            comment_id,content,post_id: id,status:'pending'
        }
    })
    .then(function (response) {
        //console.log(response);
    })
    .catch(function (error) {
        //console.log(error);
    });
    comments[id] = all_comments;
    res.status(201).send(comments[id]);
});
app.post('/events',(req,res) => {
    console.log(`event type : ${req.body.type}`);
    const {type,data} = req.body;

    if (type == 'comment_moderated') {
        const{ comment_id,content,id,status} = data;
        const all_comments = comments[id] || [];

        const comment = all_comments.find(comment => comment.comment_id == comment_id);
        comment.status = status;

        axios.post('http://bus-srv:5000/events',{
            type: 'comment_updated',
            data: {
                comment_id,content,id,status
            }
        })
        .then(function (response) {
            //console.log(response);
        })
        .catch(function (error) {
            //console.log(error);
        });


    }
    res.send({})
});

app.listen(4000 ,() => {
    console.log('listening on 4000');
});