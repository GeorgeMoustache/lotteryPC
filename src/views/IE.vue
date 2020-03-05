<template lang="pug">
.ie-wrap
  <div class="ie-alert-wrap">
    <h1>是时候升级你的浏览器了</h1>
    <p>你正在使用 Internet Explorer 的早期版本（IE9以下版本 或使用该内核的浏览器）。这意味着在升级浏览器前，你将无法访问此网站。</p>
    <hr>
    <h2>请注意：Windows XP 及 Internet Explorer 早期版本的支持已经结束</h2>
    <p>自 2016 年 1 月 12 日起，Microsoft 不再为 IE 11 以下版本提供相应支持和更新。没有关键的浏览器安全更新，您的 PC 可能易受有害病毒、间谍软件和其他恶意软件的攻击，它们可以窃取或损害您的业务数据和信息。请参阅 <a href="https://www.microsoft.com/zh-cn/WindowsForBusiness/End-of-IE-support">微软对 Internet Explorer 早期版本的支持将于 2016 年 1 月 12 日结束的说明</a> 。</p>
    <hr>
    <h2>更先进的浏览器</h2>
    <p>推荐使用以下浏览器的最新版本。如果你的电脑已有以下浏览器的最新版本则直接使用该浏览器访问<b id="referrer"></b>即可。</p>
    <ul class="browser">
      <li class="browser-chrome"><a href="http://www.google.cn/chrome/browser/index.html?hl=zh-CN&standalone=1" target="_blank"> 谷歌浏览器<span>Google Chrome</span></a></li>
      <li class="browser-360"><a href="http://se.360.cn/" target="_blank"> 360安全浏览器 <span>360用户推荐</span></a></li> <!-- 2016-08-06 -->
      <li class="browser-firefox"><a href="http://www.firefox.com.cn/" target="_blank"> 火狐浏览器<span>Mozilla Firefox</span></a></li>
      <li class="browser-ie"><a href="http://windows.microsoft.com/zh-cn/internet-explorer/download-ie" target="_blank"> IE浏览器<span>Internet Explorer</span></a></li>
      <li class="browser-qq"><a href="http://browser.qq.com/" target="_blank"> QQ浏览器9 <span>全新升级版本</span></a></li> <!-- 9.4.8187.400 -->
      <div class="clean"></div>
    </ul>
    <hr>
    <h2>为什么会出现这个页面？</h2>
    <p>如果你不知道升级浏览器是什么意思，请请教一些熟练电脑操作的朋友。如果你使用的不是IE6/7/8/9/10，而是360浏览器、QQ浏览器、搜狗浏览器等，出现这个页面是因为你使用的不是该浏览器的最新版本，升级至最新即可。</p>
    <hr>
  </div>
  .ie-alert-bg
</template>

<script>
export default {
  name: 'IE'
}
</script>

<style>
.ie-wrap {
  display: none;
}
/*-- IE 弹窗 --*/
.ie-alert-wrap { background: #fff;  position: fixed; left: 50%; top: 50%; margin:-280px 0  0 -480px;  color: red; z-index: 9999; font-size: 24px; text-align: center;  }
.ie-alert-wrap a { color: #0072c6; }
.ie-alert-wrap { width:960px; padding:10px; font-size:14px;line-height:24px;color:#454545;font-family:'Microsoft YaHei'}
.ie-alert-wrap h1{font-size:40px;line-height:80px;font-weight:100;margin-bottom:10px;}
.ie-alert-wrap h2{font-size:20px;line-height:25px;font-weight:100;margin:10px 0;}
.ie-alert-wrap em{color:red}
.ie-alert-wrap p{margin-bottom:10px;}
.ie-alert-wrap hr{margin:20px 0;border:0;border-top:1px solid #dadada}
.ie-alert-wrap img{width:34px;height:34px;border:0;float:left;margin-right:10px;}
.ie-alert-wrap span{display:block;font-size:12px;line-height:12px;}
.ie-alert-wrap .clean{clear:both;}
.ie-alert-wrap .browser{ padding:10px 0;overflow: hidden; padding-left: 100px;}
.ie-alert-wrap .browser li{width:118px;height:34px;line-height:22px;float:left;list-style:none;background:url('~assets/themeMix/ie-support.png') no-repeat;padding-left:40px}
.ie-alert-wrap .browser .browser-firefox{background-position:0 -34px}
.ie-alert-wrap .browser .browser-ie{background-position:0 -68px}
.ie-alert-wrap .browser .browser-2345{background-position:0 -102px}
.ie-alert-wrap .browser .browser-qq{background-position:0 -136px}
.ie-alert-wrap .browser .browser-360{background-position:0 -170px}
.ie-alert-bg { background: #000; opacity: 0.8; filter: progid:DXImageTransform.Microsoft.Alpha(opacity=80); width:100%; height: 100%; position: fixed; left: 0; top: 0; z-index: 9998  }
</style>
