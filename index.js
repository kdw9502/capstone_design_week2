const express = require('express');
const app = express();
const bodyParser = require('body-parser');
util =  require('util');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.text());
const port = 8000;


const get_callback = function (req, res) {
    let json_data = req.query;
    json_data = add_additional_date(json_data, req);

    res.send(json_data)
};

const post_callback = function (req, res) {
    console.log(req.body)
    let json_data = req.body;
    json_data = add_additional_date(json_data, req);

    res.send(json_data)
};

const add_additional_date = function (original_json, req) {
    let json_data = typeof original_json === 'string' ? JSON.parse(original_json) : original_json;
    json_data["email"] = "kdw9502@gmail.com";
    json_data["stuno"] = "20141494";

    let now_date = new Date().toISOString().split('T');
    let year_month_day = now_date[0];
    let hour_minute_second = now_date[1].split('.')[0];

    json_data["time"] = year_month_day + " " + hour_minute_second;
    json_data["ip"] = req.ip.replace(/^.*:/, '');

    return json_data
};
mysql = require('mysql');
const mysql_select_all = function (callback) {
    var connection = mysql.createConnection(
        {
            host: '18.232.93.89',
            user: 'kdw9502',
            password: 'rkdehddnr1',
            database: 'kdw9502_db'
        }
    )
    connection.connect();

    connection.query('SELECT * from temperature;', function (error, results, fields) {
        connection.end();
        callback(results);
    })

};

fs = require('fs');
const get_graph = function(req, res)
{
    mysql_callback = function() {

        fs.readFile('./template.html', function (error, html) {
            mysql_select_all(function (results) {
                html = html.toString();


                let header = "data.addColumn('date', 'Date/Time');";
                header += "data.addColumn('number', 'Temperature');";

                var data = "";
                var comma = ""
                for (var i = 0; i < results.length; i++) {
                    r = results[i];
                    date = r.datetime
                    data += comma + util.format("[new Date(%s,%s,%s,%s),%i]", date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), r.temperature);
                    comma = ",";
                }


                html = html.replace("{HEADER}", header);
                html = html.replace("{TABLE}", data);

                res.writeHeader(200, {"Content-Type": "text/html"});
                res.write(html);
                res.end();
            })


        });
    };
    mysql_select_all(mysql_callback);
}

app.post('/', post_callback);
app.get('/get', get_callback);
app.get('/', get_callback);
app.get('/graph', get_graph);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

