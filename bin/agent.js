var express = require('express');
var url = require('url');
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var targetUrl = 'https://cnodejs.org/';

superagent.get(targetUrl).end(function(err, res) {
    if (err) {
        return console.error(err);
    }
    var topicUrls = [];
    var $ = cheerio.load(res.text);
    // 获取首页所有的链接
    $('#topic_list .topic_title').each(function(idx, element) {
        var $element = $(element);
        var href = url.resolve(tUrl, $element.attr('href'));
        console.log(href);
        //topicUrls.push(href);
    });
});


//第一步：得到一个 eventproxy 的实例
var ep = new eventproxy();
//第二步：定义监听事件的回调函数。
//after方法为重复监听
//params: eventname(String) 事件名,times(Number) 监听次数, callback 回调函数
ep.after('topic_html', topicUrls.length, function(topics) {
    // topics 是个数组，包含了 40 次 ep.emit('topic_html', pair) 中的那 40 个 pair
    //.map
    topics = topics.map(function(topicPair) {
        //use cheerio
        var topicUrl = topicPair[0];
        var topicHtml = topicPair[1];
        var $ = cheerio.load(topicHtml);
        return ({
            title: $('.topic_full_title').text().trim(),
            href: topicUrl,
            comment1: $('.reply_content').eq(0).text().trim()
        });
    });
    //outcome
    console.log('outcome:');
    console.log(topics);
});
//第三步：确定放出事件消息的
topicUrls.forEach(function(topicUrl) {
    superagent.get(topicUrl)
        .end(function(err, res) {
            console.log('fetch ' + topicUrl + ' successful');
            ep.emit('topic_html', [topicUrl, res.text]);
        });
});
