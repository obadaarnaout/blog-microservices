const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events',async (req,res) => {
    console.log(`event type : ${req.body.type}`);
    const {type,data} = req.body;

    if (type == 'create_comment') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';
        const{comment_id,content,post_id} = data;
        await axios.post('http://bus-srv:5000/events',{
            type: 'comment_moderated',
            data: {
                comment_id,content,id: post_id,status
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

app.listen(5002,() => {
    console.log('listening on 5002');
});