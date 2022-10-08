const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handelEvent = (type,data) => {
    if (type == 'create_post') {
        const{id,title} = data;
        posts[id] = {id,title,comments:[]};
    }

    if (type == 'create_comment') {
        const{comment_id,content,post_id,status} = data;
        posts[post_id].comments.push({comment_id,content,status});
    }

    if (type == 'comment_updated') {
        const{ comment_id,content,id,status} = data;
        const all_comments = posts[id].comments || [];

        const comment = all_comments.find(comment => comment.comment_id == comment_id);
        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts',(req,res) => {
    res.send(posts);
});
app.post('/events',(req,res) => {
    console.log(`event type : ${req.body.type}`);
    const {type,data} = req.body;
    handelEvent(type,data);
    res.send({})
});

app.listen(5001,() => {
    console.log('listening on 5001');
    axios.get('http://bus-srv:5000/events').then(function (response) {
        for (const event of response.data) {
            handelEvent(event.type,event.data);
        }
    }).catch(function (error) {console.log(error);});

});