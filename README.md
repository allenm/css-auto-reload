css auto reload 介绍：
======================
css auto reload 是一款 chrome 开发者插件。它可以在你编辑 css 的时候，自动在页面上重新载入最新的 css 文件，
以达到立即展现你刚刚做的改变的目的。特别适合在双屏环境下进行 web 前端开发，使你不必在编辑器和浏览器之间不停的切换，
提高工作效率。

项目主页(Github pages):
====================
使用说明，版本变更记录，请阅读项目主页：

中文版：http://allenm.github.com/css-auto-reload/

English version: http://allenm.github.com/css-auto-reload/#en-version

特性:
----------------------
* 只需要安装一个 chrome 插件，不需要特殊的服务器端，不需要特意改变你的页面
* 需要的时候，只需要点击一下插件栏的图标即可对当前页面开启监控，不需要的时候，再次点击以关闭
* 此插件不会更改任何 DOM 结构，也不会在你页面的 js 执行环境中执行任何 js ,绝不干扰你页面的任何代码
* 在你没改变 css 的时候，页面不会 reload css ，调试面板中网络一栏不会多出很多请求
* 支持 css 和 page 不同域的情况
* 支持 css 相对路径，绝对路径
* 支持 @import ， @import 进来的 css 如果发生了改变也会 reload
* 部分支持 file:// 打开的页面，详情请看项目主页


暂不支持:
----------------------
* 不支持页面中的 iframe 内的 css 变化

Copyright and license
------------------------
Copyright 2012 allenm <http://blog.allenm.me> 

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
