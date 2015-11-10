var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false,
        loadPlugins: false
    }
});
phantom.outputEncoding = "gbk"; //解决乱码问题
casper.start();

var keyword = '王凡';
var url = "http://s.weibo.com/pic/" + encodeURI(keyword) + "&Refer=pic_box"
casper.thenOpen(url, function() {
    // this.echo('\n' + this.getCurrentUrl());
    // fs.write('page.htm', this.getHTML(), 'w');
    this.echo(this.getHTML());
    casper.exit();
});
casper.run();




