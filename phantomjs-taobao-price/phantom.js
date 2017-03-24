var page = require('webpage').create();

page.onInitialized = function() {
    page.onCallback = function(data) {
        console.log('Main page is loaded and ready');
        //Do whatever here
    };

    page.evaluate(function(data) {
        document.addEventListener('DOMContentLoaded', function() {
            window.callPhantom();
        }, false);

        console.log("Added listener to wait for page ready");
    });

};

var url = 'https://item.taobao.com/item.htm?spm=a219r.lm5807.14.24.dz0pwj&id=540346679493&ns=1&abbucket=6#detail';
// var url = 'http://www.baidu.com';
page.open(url, function(status) {
    // page.render('taobao.png');
    var data = page.evaluate(function() {
        return {
            title: document.title,
            price: document.getElementById('J_PromoPriceNum').innerText
        }
    })
    console.log('title = ' + data.title);
    console.log('price = ' + data.price);
    // console.log(document.title);
    // console.log(status);
});

page.onLoadFinished = function(status) {
  console.log('Status: ' + status);
  // Do other things here...
};



// page.open('http://www.baidu.com', function(status) {
//   if (status !== 'success') {
//     console.log('Unable to access network');
//   } else {
//     var ua = page.evaluate(function() {
//       return document.title;
//     });
//     console.log(ua);
//   }
//   phantom.exit();
// });