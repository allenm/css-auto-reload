/**
 * author allenm i@allenm.me 
 * date 2012-02-15
 * get the page's css , and tell the background page , then if the css changed , background page will tell this to reload css
 */

(function ( ) {

    var Util = {
        toArr:function ( arrLike ) {
            return Array.prototype.slice.call( arrLike );
        },

        getAttr:function( dom, attrName ){
            return dom.getAttribute(attrName);
        },

        setAttr:function ( dom, attrName, attrValue ) {
            return dom.setAttribute( attrName, attrValue );
        },

        /**
         * get absolute url 
         */
        getAbsUrl:function( url ) {
            if( /https{0,1}:\/\//.test(url) ) {
                return url;
            }else if( url.slice(0,2) === '//' ){  // 省略协议的 URL
                return window.location.protocol + url;
            } else if ( url.slice(0,19) === 'chrome-extension://' ){  // filter the url start with chrome-extension:// 
                return false;
            } else if ( window.location.origin === 'file://' ){  // 使用 file:// 打开的页面 ,并且使用了相对路径
                return 'file';
            }else{
                var href = window.location.href,
                    basePathArr = href.split('/');
                basePathArr.pop();


                var urlArr = url.split('/'),
                    tmpArr = [];
                
                if( urlArr[0] === "" ){
                    return window.location.origin + url;
                }
                urlArr.forEach( function ( item ) {
                    if( item === '..'){
                        basePathArr.pop();
                    }else if( item === '.'){
                        // do nothing 
                    }else{
                        basePathArr.push( item );
                    }
                });
                return basePathArr.join('/');
            }
        },

        // fix cache problem
        addTimeStamp:function ( url ) {
            var now = (new Date())-0;
            var url = url.replace(/[\?|&]_reload_time=\d+/,"");
            if( url.indexOf("?") === -1 ){
                return url+'?_reload_time='+now;
            }else{
                return url+'&_reload_time='+now;
            }
        }
    }

    var main = {

        fileReloadTimer:null,

        init:function ( ) {
            this.initSendCssLinks();
            this.initOnRequest();
        },

        /** 向 background 发送 css list */
        initSendCssLinks:function ( ) {
            var cssLinks = this._getCssLinks();
            chrome.extension.sendRequest({
                "action":"initCssList",
                "data":cssLinks.urls
            }, function(response) {
                console.log(response);
            });

            if( cssLinks.files.length > 0 ){
                this._watchFiles( cssLinks.files );
            }
        },

        _watchFiles:function ( files ) {
            var self = this;
            this.fileReloadTimer = setInterval(function ( ) {
                files.forEach( function ( item ) {
                    self._reloadLinkItem( item );
                });
            }, 1000 );
        },

        _unWatchFiles:function ( ) {
            if( this.fileReloadTimer ){
                clearInterval( this.fileReloadTimer );
            }
        },

        _getCssLinks:function ( ) {
            var links = Util.toArr(document.getElementsByTagName('link')),
                urls = [],
                files = [];

            links.forEach( function ( item ) {
                if( Util.getAttr(item ,'rel') === 'stylesheet' ){
                    var URI = Util.getAbsUrl(Util.getAttr(item , 'href'));
                    if( URI ){
                        if( URI === 'file' ){  // 以 file 形式加载的
                           files.push( item ); 
                        }else{
                            urls.push( URI );
                        }
                    }
                }
            });

            return { files: files, urls:urls };

        },

        initOnRequest:function ( ) {
            var self = this;
            chrome.extension.onRequest.addListener(function ( request, sender, sendRequest ) {

                switch ( request.action ){
                    case 'reloadCss':
                        self._reloadCss();
                        break;
                    case 'unWatch':
                        self._unWatchFiles();
                        break;
                    default:
                        break;
                }
            });
        },
        
        _reloadCss: function ( ) {
            var links = Util.toArr(document.getElementsByTagName('link')),
                now = (new Date())-0,
                self = this;

            links.forEach( function ( item ) {
                self._reloadLinkItem( item );
            });

        },

        _reloadLinkItem:function ( link ) {
            if( Util.getAttr(link ,'rel') === 'stylesheet' ){
                var href = Util.getAttr( link , 'href' );
                if( href.slice(0,19) === 'chrome-extension://' ){
                    return ;
                }
                var href = Util.addTimeStamp( href );
                Util.setAttr( link , 'href', href );
            }
        }


    }

    main.init();
    
})();
