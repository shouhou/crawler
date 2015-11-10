var fs = require('fs');
var casper = require('casper').create({
    // clientScripts: ["jquery-1.11.3.js"],
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false, // The WebPage instance used by Casper will
        loadPlugins: false // use these settings
    }
});
phantom.outputEncoding = "gbk"; //解决乱码问题

casper.start();
var url = "http://s.weibo.com/pic/wf&Refer=pic_box/";
casper.thenOpen(url, function() {
    this.echo('\n' + this.getCurrentUrl());
    fs.write('page.htm', this.getHTML(), 'w');
    casper.exit();
});
// casper.then(function getImgs() {
//     var imgs = [];
//     this.click('.searchBtn');
//     casper.evaluate(function getPriceFromPage() {
//         // document.getElementsByTagName('title')[0].innerHTML;
//         $('img').each(function(index, el) {
//             casper.echo($(el).attr('src'));
//             imgs.push($(el).attr('src'));
//         });
//     });
//     console.log(imgs); 
// });
casper.run();
