const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.text());
const port = 8000;


const get_callback = function (req, res) {
    let json_data = req.query;
    json_data = add_additional_date(json_data,req);

    res.send(json_data)
};

const post_callback = function (req,res)
{
    console.log(req.body)
    let json_data = req.body;
    json_data = add_additional_date(json_data,req);

    res.send(json_data)
};

const add_additional_date = function (original_json,req)
{
    let json_data = typeof original_json === 'string' ? JSON.parse(original_json) : original_json;
    json_data["email"] = "kdw9502@gmail.com";
    json_data["stuno"] = "20141494";

    let now_date = new Date().toISOString().split('T');
    let year_month_day = now_date[0];
    let hour_minute_second = now_date[1].split('.')[0];

    json_data["time"] = year_month_day + " " + hour_minute_second;
    json_data["ip"] = req.ip.replace(/^.*:/,'');

    return json_data
};

app.post('/', post_callback);
app.get('/get', get_callback);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
