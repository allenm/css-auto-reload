/**
 * author allenm i@allenm.me
 * date 2012-02-15
 * css auto reload
 */

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-34647592-2']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

(function ( ) {
    

    var main = {

        _status:{
        },

        init:function ( ) {
            this.initBrowserAction();
            this.initOnRequest();
            this.initOnTabUpdate();
            this.initOnRemoved();
            this.initVersionTip();
        },

        /** browser action control */
        initBrowserAction:function ( ) {
            var self = this;
            chrome.browserAction.onClicked.addListener(function( tab ) {
                if( !self._status[ tab.id ] ){
                    chrome.tabs.executeScript( tab.id, { "file":"js/insert2page.js" });
                    chrome.browserAction.setIcon( {
                        tabId: tab.id,
                        path: 'imgs/refresh-19.png'
                    });
                    self._status[ tab.id ] = true;
                    console.log('start watch tab '+ tab.id );
                }else{
                    Compare.unWatch( tab.id );
                    chrome.browserAction.setIcon( {
                        tabId: tab.id,
                        path: 'imgs/refresh-unactive-19.png'
                    });
                    self._status[ tab.id ] = false;
                    console.log('stop watch tab '+ tab.id );
                }
            });
        },

        /** 收到后台发送的 css list 后开始监听 */
        initOnRequest:function ( ) {
            var self = this;
            chrome.extension.onRequest.addListener(function ( request, sender, sendResponse ) {
                if( request.action && request.action === 'initCssList' ){
                    console.log( 'start watch: ');
                    console.log( request.data );
                    Compare.addWatch( sender.tab.id, request.data, function ( ) {
                        console.log( sender.tab.id + ' have changed');
                        self.request2Reload( sender.tab.id );
                    });
                    sendResponse('init css auto reload ok');
                    self.request2Reload( sender.tab.id ); //先更新一次
                }
            });
        },

        initOnTabUpdate:function ( ) {
            var self = this;
            chrome.tabs.onUpdated.addListener( function ( tabId, changeInfo ) {

                if( self._status[ tabId ]=== true && changeInfo.status === 'complete' ){
                    chrome.tabs.executeScript( tabId, { "file":"js/insert2page.js" });
                    chrome.browserAction.setIcon( {
                        tabId: tabId,
                        path: 'imgs/refresh-19.png'
                    });
                }
            });
        },

        initOnRemoved:function ( ) {
            var self = this;
            chrome.tabs.onRemoved.addListener( function ( tabId ) {
                if( self._status[ tabId ] === true ){
                    Compare.unWatch( tabId );
                    self._status[ tabId ] = false;
                }
            });
        },

        request2Reload:function ( tabId ) {
            chrome.tabs.sendRequest( tabId, {"action":"reloadCss"});
        },

        initVersionTip:function ( ) {
            /**
            var self = this;
            var xhr = new XMLHttpRequest();
            xhr.open("GET",chrome.extension.getURL('manifest.json'), true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var data = JSON.parse( xhr.responseText );
                    var version = data.version;
                    var str = 'version'+version;
                    if( window.localStorage.getItem( str ) !== '1' ){
                    //if( true ){
                        self._showVersionTip( version );
                        window.localStorage.setItem( str , '1' );
                        _gaq.push(['_trackEvent','versionUpdate',version]);
                    }
                }
            };
            xhr.send(); 
            **/
            var version = '1.1.0';
            var self = this;
            var str = 'version'+version;
            if( window.localStorage.getItem( str ) !== '1' ){
            //if( true ){
                self._showVersionTip( version );
                window.localStorage.setItem( str , '1' );
                _gaq.push(['_trackEvent','versionUpdate',version]);
            }

            
        },

        _showVersionTip:function ( version ) {
            chrome.i18n.getAcceptLanguages( function ( lanList ) {
                console.log( lanList );
                var lan = "en"
                lanList.forEach(function ( item ) {
                    if( item === "zh-CN" || item === "zh" ){
                        lan = 'zh';
                        return false;
                    }
                });
                var url = 'http://allenm.github.com/css-auto-reload/#version-' + version;
                if( lan === 'en' ){
                    url = url+'-en';
                }
                chrome.tabs.create({
                    url:url
                });
            });
        }


    }

    main.init();

})();
