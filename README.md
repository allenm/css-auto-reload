css auto reload 介绍：
======================
css auto reload 一款 chrome 开发者插件。它可以在你编辑 css 的时候，自动在页面上重新载入最新的 css 文件，
以达到立即展现你刚刚做的改变的目的。特别适合在双屏环境下进行 web 前端开发，使你不必在编辑器和浏览器之间不停的切换，
提高工作效率。

特性:
----------------------
* 只需要安装一个 chrome 插件，不需要特殊的服务器端，不需要特意改变你的页面
* 需要的时候，只需要点击一下插件栏的图标即可对当前页面开启监控，不需要的时候，再次点击以关闭
* 此插件不会更改任何 DOM 结构，也不会在你页面的 js 执行环境中执行任何 js ,绝不干扰你页面的任何代码
* 在你没改变 css 的时候，页面不会 reload css ，调试面板中网络一栏不会多出很多请求
* 支持 css 和 page 不同域的情况
* 支持 css 相对路径，绝对路径
* 支持 @import ， @import 进来的 css 如果发生了改变也会 reload


暂不支持:
----------------------
* 不支持通过 file:// 打开的页面
* 不支持页面中的 iframe 内的 css 变化


使用说明:
---------------------
* 先去 chrome 应用商店安装此 chrome 插件，地址：https://chrome.google.com/webstore/detail/fiikhcfekfejbleebdkkjjgalkcgjoip
* 安装完成可以看到一个这样的图标：![css auto reload icon](http://static.allenm.me/imgs/icon-unactive.png)
* chrome 切换到你想监控 css 变化的标签页，然后点击插件图标，插件图标会变成彩色的 ![colorful icon](http://static.allenm.me/imgs/icon-active.png)
* 当图标处于彩色状态说明正在监控中，你可以再次点击关闭监控，关闭后，图标变成灰色
* 操作演示视频：[youku](http://v.youku.com/v_show/id_XMzU3MDc5NzI0.html "css auto reload") [youtube](http://www.youtube.com/watch?v=pQgBr5JmxIs&feature=youtu.be "css auto reload")

