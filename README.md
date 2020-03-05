# lotterypc

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# [!!!] push new lottery step
> - src/store/modules/countdown.js
> - src/utils/lottery/"category".js(tip => help)
> - src/utils/lottery/rules
> - src/components/Rules/...（注意，themeMix，themeBoMao
> - src/components/LotteryInfo.vue (openNumClsFn、randomNum)
> - src/components/BetDrawBar.vue
> - src/utils/mixins.js/formatNums

### api format
``` json
{
	// 基本
	"code": 0, // 0:成功, -1:失败, 401:无权限
	"msg": "提示信息",

	// 分页表格
	"list": [],
	"total": 30, // 数据总数
	"current": 1, // 当前页面
	"size": 20 // 每页数量
}
```

# 网站之间的差异
* 模版2
  * lottery/config.action => themeName: 'theme2'
  ps: add: lottery-theme2.scss、Index2.vue

# TODO:
- [ ] 两面盘切换，不获取 recordBet.action
- [ ] 缓存+更新 lotteryMode.action

- [ ] 传统玩法 lotteryModeCT || lotteryModeTheme2

# package.json 传递参数
```json
"dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js --env.name=xxx",
```
```javascript
const name = process.argv[process.argv.length - 1].replace(/^(\S)*=/, '');
```
