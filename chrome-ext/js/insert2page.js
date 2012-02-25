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
            if( /https{0,1}:\/\//.test(url) ){
                return url;
            }else{
                var href = window.location.href,
                    basePathArr = href.split('/');
                basePathArr.pop();

                var urlArr = url.split('/'),
                    tmpArr = [];

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
        }
    }

    var main = {
        init:function ( ) {
            this.initSendCssLinks();
            this.initOnRequest();
        },

        initSendCssLinks:function ( ) {
            var cssLinks = this._getCssLinks();
            chrome.extension.sendRequest({
                "action":"initCssList",
                "data":cssLinks
            }, function(response) {
                console.log(response);
            });
        },

        _getCssLinks:function ( ) {
            var links = Util.toArr(document.getElementsByTagName('link')),
                result = [];

            links.forEach( function ( item ) {
                if( Util.getAttr(item ,'rel') === 'stylesheet' ){
                    result.push( Util.getAbsUrl(Util.getAttr(item , 'href')));
                }
            });

            console.log( result );

            return result;

        },

        initOnRequest:function ( ) {
            var self = this;
            chrome.extension.onRequest.addListener(function ( request, sender, sendRequest ) {
                if( request.action === 'reloadCss' ){
                    self._reloadCss();
                }
            });
        },
        
        _reloadCss: function ( ) {
            var links = Util.toArr(document.getElementsByTagName('link')),
                now = (new Date())-0;

            links.forEach( function ( item ) {
                if( Util.getAttr(item ,'rel') === 'stylesheet' ){
                    var href = Util.getAttr( item , 'href' );
                    Util.setAttr( item , 'href', href );
                }
            });

        }

    }

    main.init();
    
})();
