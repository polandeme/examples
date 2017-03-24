var phridge  = require('phridge');

exports.getInfo = function (req, res) {
    var data = {};
    data.url = 'https://item.taobao.com/item.htm?spm=a219r.lm5807.14.24.dz0pwj&id=540346679493&ns=1&abbucket=6#detail';
    // data.url = 'https://www.baidu.com';
    getGoodsInfo(req, res, data);
}

function getGoodsInfo(req, res, data) {
    var start = new Date();
    phridge.spawn({
        "loadImages": false,
    })
    .then(function(phantom) {
        var page = phantom.createPage();
        return page.run(data, function(data, resolve, reject) {
            var page = this;

            page.onInitialized = function() {
                page.onCallback = function(data) {
                    console.log('Main page is loaded and ready');
                }

                page.evaluate(function(data) {
                    document.addEventListener('DOMContentLoaded', function() {
                        window.callPhantom('DOMContentLoaded');
                    }, false);
                });
            }
            page.open(data.url, function(status) {
            });

            page.onResourceRequested = function(requestData, request) {

              if ((/https:\/\/.+?\.html$/gi).test(requestData['url']) || 
                  (/https:\/\/.+?\.jpg$/gi).test(requestData['url']) || 
                  (/https:\/\/.+?\.gif$/gi).test(requestData['url']) ||
                  // (/https:\/\/.+?\.css$/gi).test(requestData['url']) ||
                  (/https:\/\/.+?\.png$/gi).test(requestData['url']) ||
                  (/https:\/\/g.alicdn.com\/alilog\/oneplus\/blk.html/).test(requestData['url']) ||
                  (/https:\/\/g.alicdn.com\/alilog\/oneplus\/blk.html/).test(requestData['url']) ||
                  ((/https:\/\/mpp.taobao.com\/ajaxconn2.html/).test(requestData['url']))
                ) {
                    console.log('Skipping', requestData['url']);
                    request.abort();
              }

            };

            var count = 0;
            /**
             * 增加try catch机制，用来重试，或者使用计数器更具iframe个数来判断全部加载完成
             */
            page.onLoadFinished = function(status) {
                if(status != 'success') {
                    console.log('return ');
                    return ;
                }
                console.log(status);
                if(status == 'success') {
                    page.render('taobao.png');
                    setTimeout(function() {
                        resolve(page.evaluate(function() {
                                return {
                                    title: document.title,
                                    price: document.getElementById('J_PromoPriceNum').innerText,
                                    thumb_url: document.querySelector('#J_UlThumb img').src
                                }
                            })
                        );
                    }, 2000);
                }

            };
        })
    })
    .then(function(_data) {
        console.log('time = ' + (new Date() - start) / 1000);
        res.send(_data);
    })
    .catch(function(err) {
        console.log('error msg = ' + err);
    })

}

