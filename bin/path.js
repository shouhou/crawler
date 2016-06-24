/**
 * Crawler For NUS-WIDE Images
 * @authors LingYao (shouhouml@gmail.com)
 * @date    2015-09-15 20:07:13
 */
var fs = require('fs');
var http = require('http');
var request = require('request');

var saveCount = 0;
var createDirectorys = [];

function readLines(input, func) {
    var remaining = '';
    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            func(line);
            index = remaining.indexOf('\n');
        }
    });
    input.on('end', function() {
        if (remaining.length > 0) {
            func(remaining);
        }
    });
}

function handleLine(data) {
    var urls = '';
    var localPath = '',
        id = '',
        largePath = '',
        middlePath = '',
        smallPath = '',
        originalPath = '';
    if (data && data.length > 0) {
        data = data.replace(/\s+/g, ' ');
        urls = data.split(' ');
        if (urls && urls.length >= 6) {
            localPath = urls[0];
            id = urls[1];
            largePath = urls[2];
            middlePath = urls[3];
            smallPath = urls[4];
            originalPath = urls[5];
        }
        if (localPath && middlePath !== 'null') {
            var _arr = localPath.split('\\');
            var localDirectory = 'G:\\' + _arr.slice(1, _arr.length - 1).join('\\') + '\\';
            var fileName = _arr[_arr.length - 1];
            fs.exists(localDirectory, function(exists) {
                if (!exists) {
                    if (createDirectorys.indexOf(localDirectory) === -1) {
                        console.log('create:', localDirectory);
                        createDirectorys.push(localDirectory);
                        fs.mkdir(localDirectory, function(err) {
                            if (err) {
                                console.log('create:', err);
                            } else {
                                saveImgs(localDirectory + fileName, middlePath, function() {
                                    saveCount++;
                                });
                            }
                        });
                    }
                } else {
                    saveImgs(localDirectory + fileName, middlePath, function() {
                        saveCount++;
                    });
                }
            })
        }
    }
}

function saveImgs(localPath, remotePath, callback) {
    var options = { //设置本地代理
        host: '127.0.0.1',
        port: '1080',
        path: remotePath
    }
    var req = http.request(options);
    var chunks = '';
    // var chunks = [];

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
            // chunks.push(chunk);
        });
        res.on('end', function() { //Buffer.concat(chunks) 乱码
            fs.appendFile(localPath, chunks, 'binary', function(err) {
                if (err) {
                    console.log('write:', err);
                }
                callback(err);
            });
        });
    });
    req.end();
}

/*function saveImgs(localPath, remotePath, callback) {
    var options = {
        url: remotePath,
        headers: {
            'Referer': 'http://www.umei.cc/' // 必须添加Referer，否则会被拒绝下载
        }
    };
    var stream = request(options);
    stream.pipe(fs.createWriteStream(localPath).on('error', function(error) {
        callback(error, localPath);
        stream.read();
    });).on('close', callback);
}*/

(function run() {
    var input = fs.createReadStream('urls.txt');
    readLines(input, handleLine);
})();
