var utils = require("utils");
var casper = require('casper').create({
    verbose: false,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false,
        loadPlugins: false
    }
});
phantom.outputEncoding = "gbk"; //解决乱码问题


var keyword = casper.cli.args[0] || 'default';
// casper.echo(utils.dump(casper.cli.args));
// casper.echo(utils.dump(casper.cli.options));

var url = "http://s.weibo.com/pic/" + encodeURI(keyword) + "&Refer=pic_box"
casper.start(url);
casper.then(function() { //thenOpen
    this.echo('\n' + this.getCurrentUrl());
    // fs.write('page.htm', this.getHTML(), 'w');
    this.echo(this.getHTML());
    this.exit();
});
casper.run();

// casper.then(function() {
//     // aggregate results for the 'casperjs' search
//     links = this.evaluate(getLinks);
//     // now search for 'phantomjs' by filling the form again
//     this.fill('form[action="/search"]', { q: 'phantomjs' }, true);
// });

// casper.then(function getImgs() {
//     var imgs = [];
//     this.click('.searchBtn');
//     casper.evaluate(function() {
//         //document.getElementsByTagName('title')[0].innerHTML;
//         $('img').each(function(index, el) {
//             casper.echo($(el).attr('src'));
//             imgs.push($(el).attr('src'));
//         });
//     });
//     console.log(imgs); 
// });


/*   googlelinks.js   */
// var links = [];
// var casper = require('casper').create();

// function getLinks() {
//     var links = document.querySelectorAll('h3.r a');
//     return Array.prototype.map.call(links, function(e) {
//         return e.getAttribute('href');
//     });
// }

// casper.start('http://google.fr/', function() {
//     // search for 'casperjs' from google form
//     this.fill('form[action="/search"]', { q: 'casperjs' }, true);
// });

// casper.then(function() {
//     // aggregate results for the 'casperjs' search
//     links = this.evaluate(getLinks);
//     // now search for 'phantomjs' by filling the form again
//     this.fill('form[action="/search"]', { q: 'phantomjs' }, true);
// });

// casper.then(function() {
//     // aggregate results for the 'phantomjs' search
//     links = links.concat(this.evaluate(getLinks));
// });

// casper.run(function() {
//     // echo results in some pretty fashion
//     this.echo(links.length + ' links found:');
//     this.echo(' - ' + links.join('\n - ')).exit();
// });

/*   renren.js   */
// var casper = require('casper').create({
//     verbose: false,
//     logLevel: 'debug'
// });
// casper.start('http://www.renren.com/');
// casper.wait(500, function() {
//     this.capture("start.png");
// });
// casper.wait(500, function() {
//     this.fill('form#loginForm', {
//         email: '1241563764@qq.com',
//         password: 'qazzaqqq'
//     }, false);
// });
// casper.then(function() {
//     this.click("#login");
// });
// casper.wait(2500, function() {
//     this.capture("after.png");
//     this.exit();
// });
// casper.run();
