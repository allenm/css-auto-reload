/**
 * author allenm i@allenm.me 
 * date 2012-02-19
 */

var Compare = {

    _cssList : [],
    _watchList:{},

    _cssCache : {}, 

    init:function ( ) {
        var self = this;
        setInterval( function ( ) {
            self._doCompare();
        },1000);
    },

    // 执行比较 
    _doCompare:function ( ) {
        var cssList = this._getDistinctList(),
            self = this;

        cssList.forEach( function ( item ) {
            self._getCssContent( item , function ( content ) {
                if( self._cssCache.hasOwnProperty( item ) && self._cssCache[item] !== content ){
                    self._fireCallback( item );
                }

                self._cssCache[item] = content;
            });
        });
    },

    /**
     * 发生了改变，触发 callback
     */
    _fireCallback:function ( cssurl ) {
        for( var key in this._watchList ){
            if( this._watchList.hasOwnProperty( key )){
                var item = this._watchList[key];
                if( item.cssList.indexOf( cssurl ) !== -1 ){
                    try {
                        item.callback();
                    }catch( e ){
                        // do nothing
                    }
                }
            }
        }
    },

    //  获取去重后的 css 列表 
    _getDistinctList:function ( ) {
        var result = [];
        for( var item in this._watchList ){
            if( this._watchList.hasOwnProperty( item )){
                this._watchList[item].cssList.forEach( function ( cssLink ) {
                    if( result.indexOf( cssLink ) === -1 ){
                        result.push( cssLink );
                    }
                });
            }
        }

        return result ;
    },

    _getCssContent:function ( url,callback ) {
        var self = this;
        this._getContent( url , function ( content ) {
            self._parseCssContent( url , content , callback );
        });
    },

    _getContent:function ( url, callback ) {
        var xhr = new XMLHttpRequest();
        
        // fix cache problem
        var now = (new Date())-0;
        if( url.indexOf('?') === -1 ){
            var url = url+'?_='+now;
        }else{
            var url = url+'&_='+now;
        }
        xhr.open("GET", url , true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback && callback( xhr.responseText );
            }
        };
        xhr.send(); 
    },

    /**
     * 添加需要监控的 css
     */
    addWatch : function ( tabId , cssList, callback ){
        var self = this;
        this._watchList[ tabId ] = {
            "cssList": cssList,
            "callback": callback
        };

        cssList.forEach( function ( item ) {
            if( !self._cssCache.hasOwnProperty( item ) ){
                self._getCssContent( item , function ( content ) {
                    self._cssCache[item] = content;
                    console.log('init '+item);
                });
            }
        });
    },

    /**
     * 取消关注某个 tab 
     */
    unWatch:function ( tabId ) {
        delete this._watchList[tabId];
        chrome.tabs.sendRequest( tabId, {"action":"unWatch"});
    },

    /**
     * parse css content , support the @import syntax
     */
    _parseCssContent:function ( cssUrl, content , callback ){
        var importReg = /@import.*(?:['"](.*)['"]|url\((.*)\))/g,
            importList = [],
            self = this;
        while( true ){
            var result = importReg.exec( content );
            if( !result ){
                break;
            }else{
                var prePart = content.slice(0, result.index ),
                    startComment = prePart.lastIndexOf( '/*' ),
                    cssFile = (result[1]?result[1]:result[2]).trim();

                if( !cssFile ){
                    break;
                }

                if( startComment !== -1 ){
                    var endComment = prePart.lastIndexOf('*/');
                    if( endComment !== -1 && endComment > startComment ){ //不在注释中
                        importList.push( self._getAbsUrl( cssUrl, cssFile ) );
                    }
                }else{
                    importList.push( self._getAbsUrl( cssUrl, cssFile ) );
                }
            }
        }

        if( importList.length > 0 ){
            this._getWholeContent( content, importList, callback );
        }else{
            callback( content );
        }
    },

    /**
     * 按照 import list 的顺序，把通过 @import 引入进来的 css 的内容附在 content 的后面，用来后面比较文件变化
     */
    _getWholeContent:function ( content , importList, callback ) {
        
        var cssUrl = importList.shift(),
            content = content,
            self = this,
            getSubContent = function ( cssUrl ) {
                self._getCssContent( cssUrl, function ( c ) {
                    content += c;
                    if( importList.length > 0 ){
                        getSubContent( importList.shift() );
                    }else{
                        callback( content );
                    }
                });
            };

        getSubContent( cssUrl );

    },

    /**
     * 获取相对路径对应的绝对URL
     */
    _getAbsUrl:function ( baseUrl, url ) {
        if( /https{0,1}:\/\//.test(url) ){  // 绝对 URL 
            return url;
        }

        var basePathArr = baseUrl.split('/');
        basePathArr.pop();

        var urlArr = url.split('/'),
            tmpArr = [];
        
        if( url.slice(0,2) === '//' ){ // 省略协议的 URL
          return basePathArr[0] + url;
        }

        if(url.charAt(0) === '/') {  // 省略域名的 URL
          return basePathArr.slice(0,3).join('/') + url;
        }
        
        urlArr.forEach( function ( item ) {  // 相对 URL
          if(item) {
            if( item === '..'){
              basePathArr.pop();
            }else if( item === '.'){
              // do nothing 
            }else{
              basePathArr.push( item );
            }
          }
        });
        return basePathArr.join('/');
    }


}

Compare.init();
