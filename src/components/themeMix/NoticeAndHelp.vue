<template lang="pug">
.notice_help(@mouseover="hover($event.target)")
  Tabs.tabs-card-hack(v-model="tabIndex" :animated="false")
    TabPane(
      v-for="(item, index) in list" :key="index" :name="''+index" :label="labels[index]")
      ul.news(v-if="list.length")
        li(v-for="(item, idx) in list[index]" :key="idx")
          template(v-if="index")
            router-link(
              :to="{path: `/helpInfo#help-${item.id}`}"
              :title="item.title") •&nbsp;{{item.title}}
          template(v-else)
            router-link(:to="{path: `/notice/${item.id}`}" :title="item.title") •&nbsp;{{item.title}}
      p.null(v-else) 加载中...
</template>

<script>
import { newsApi } from 'api';

export default {
  name: 'NoticeAndHelp',
  data () {
    return {
      tabIndex: '0',
      labels: ['网站公告', '新手帮助'],
      list: [[],[]]
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.fetchData()
    },
    fetchData () {
      newsApi.notice().then(data => {
        this.list.splice(0, 1, data.list.splice(0, 7))
      })
      newsApi.help().then(data => {
        this.list.splice(1, 1, data.list.splice(0, 7))
      })
    },
		hover (target) {
			if (~target.className.indexOf('ivu-tabs-tab')) {
				let label = target.innerHTML
				label = label.replace(/<!---->/g, '').trim()
				let index = this.labels.findIndex(item => item == label)
				if (index != -1) {
					this.$nextTick(() => this.tabIndex = '' + index)
				}
			}
		}
  }
}
</script>

<style lang="scss">


.notice_help {
  width: 230px;
  .ivu-tabs {
    height: 245px;
  }
  .ivu-tabs-bar {
    margin-bottom: 4px;
  }
	.ivu-tabs-nav {
		width: 228px;
	}
	.ivu-tabs-tab {
		width: 50%;
  }
  .news {
    padding-left: 10px;
    a {
      display: block;
      line-height: 28px;
      font-size: 13px;
      color: #333;
      @include ellipsis();
      &:hover {
        color: $layout-primary;
      }
    }
  }
}
</style>
