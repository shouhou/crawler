var fs = require('fs');
var http = require('http');
var async = require('async');
var cp = require('child_process');

var t = require('./t');
var log = require('./t').log;

function loadHTML(callback) {
    var html = '';
    var casper = cp.exec('casperjs casper.js', function(error, stdout, stderr) {
        if (error) {
            console.log(error.stack);
            console.log('casper error: ', error.code);
        }
        callback(stdout);
    });
}

function fetchReq(remotePath, type, callback) {
    var options = { //设置本地代理
            host: '127.0.0.1',
            port: '1080',
            path: remotePath
        }
        // var req = http.request(options);
    var req = http.request(remotePath);
    var chunks = '';
    // var chunks = [];

    req.on('error', function(err) {
        console.log('req:', err);
    });

    req.on('response', function(res) {
        // res.setEncoding('binary');utf8
        res.setEncoding(type);
        res.on('error', function(err) {
            console.log('res:', err);
        })
        res.on('data', function(chunk) {
            chunks += chunk;
            //chunks.push(chunk);
        });
        res.on('end', function() { //Buffer.concat(chunks) 乱码
            console.log(chunks);
            callback(chunks);
        });
    });
    req.end();
}

function filterImg(data) {
    var imgs = [];
    // var reg = /<ul\s+class="articlemenu">\s+<li>\s+<a[^>]*>.*?<\/a>\s+<a href="(.*?)"[^>]*>(.*?)<\/a>[\s\S]*?<div\s+class="text">([\s\S]*?)<\/div>/g;
    var reg = /<img\s[^>]*src="([^"]*?)"[^>]*>/g
    while (match = reg.exec(data)) {
        imgs.push(match[1]);
    }
    return imgs;
}

function saveImg(localPath, remotePath, callback) {
    //callback很重要，否则队列无效，必须是异步
    var options = { //设置本地代理
        host: '127.0.0.1',
        port: '1080',
        path: remotePath
    };
    // var req = http.request(options);
    var req = http.request(remotePath);
    var chunks = '';
    req.on('error', function(err) {
        console.log('req:', err);
        callback(err);
    });

    req.on('response', function(res) {
        res.setEncoding('binary');
        res.on('error', function(err) {
            console.log('res:', err);
            callback(err);
        })
        res.on('data', function(chunk) {
            chunks += chunk;
        });
        res.on('end', function() {
            fs.appendFile(localPath, chunks, 'binary', function(err) {
                if (err) {
                    console.log('write:', err);
                    callback(err);
                }
            });
            callback('success');
        });
    });
    req.end();
}

function saveImgs(urls, keyword) {
    var size = 10;
    var funcs = [];
    for (var i = 0, len = urls.length; i < len; i++) {
        var _saveImg = async.apply(saveImg, 'E:/ImageData/' + keyword + '_' + i + '.jpg', urls[i]);
        //log(_saveImg.toString());
        funcs.push({
            name: 'task' + i,
            run: _saveImg
        });
    }
    // console.log(funcs);
    var queue = async.queue(function(task, callback) {
        task.run(callback);
    }, size);

    queue.push(funcs, function(res) {
        log('res: ', res);
    });
}

(function main() {
    var keyword = '王凡';
    // var url = 'http://www.baidu.com/s?wd=' + encodeURI(keyword)
    var url = "http://s.weibo.com/pic/" + encodeURI(keyword) + "&Refer=pic_box"
    loadHTML(function(data) {
        var imgs = filterImg(data);
        // console.log(imgs);
        saveImgs(imgs, keyword);
    });
})();
