<template lang="pug">
.message-wrap
  template(v-if="list.length")
    ul.message-list
      li.item(v-for="item in list" :key="item.id")
        .item-body
          span.icon-user
          dl
            dt
              h4.message-title(v-text="item.title")
              span.message-datetime
                em(v-text="item.date")
                Icon.text-gray(type="android-time")
            dd.message-content(v-text="item.content")
        span.icon-mssage
    .table-page
      Page.inline-block(:total="total" :current="query.current" :page-size="query.size" @on-change="changePage" size="small" placement="top" show-elevator show-total)
  template(v-else)
    p.null.text-primary 暂无记录
</template>

<script>
import { mapGetters } from 'vuex';
import { accountApi } from 'api';

export default {
  name: 'ProfileMessage_List',
  props: ['fetch', 'type'],
  data () {
    return {
      isInit: false,
      // query
      query: {
        current: 1,
        size: 10,
        type: this.type
      },
      list: [],
      total: 0
    }
  },
  mounted () {
    this.fetch && this.init()
  },
  methods: {
    init () {
      this.isInit = true
      this.fetchData()
    },
    fetchData () {
      accountApi.message(this.query).then((data) => {
        if (data.code != 0) return
        this.list = data.list
        this.total = data.total
      })
    },
    changePage (value) {
      this.query.current = value
      this.fetchData()
    }
  },
  watch: {
    fetch (value) {
      if (!this.isInit && value) this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.message-list {
  .item {
    position: relative;
    min-height: 90px;
    padding: 20px 25px 20px 0;
    &:hover {
      .item-body {
        border: 2px solid #177fd9;
        margin-left: 82px;
        padding-bottom: 16px;
      }
      .icon-mssage {
        background-image: url('~assets/themeMix/msglist-active.jpg')
      }
    }
  }
  .item-body {
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    margin-left: 83px;
    min-height: 74px;
    position: relative;
    padding: 18px 20px 18px 78px;
  }
  dt {
    margin-bottom: 5px;
  }
  .message-title {
    display: inline-block;
    padding-right: 10px;
    color: #177fd9;
  }
  .message-datetime {
    position: relative;
    display: inline-block;
    padding-right: 17px;
    color: #ff9835;
    font-size: 12px;
    em {
      margin-right: 5px;
      font-style: normal;
    }
  }
  .message-content {
    word-wrap: break-word;
    font-size: 13px;
    line-height: 1.35;
  }
  .icon-user {
    position: absolute;
    width: 48px;
    height: 48px;
    background: url('~assets/themeMix/msglist-icon.png') no-repeat #177fd9 center;
    left: 19px;
    top: 19px;
  }
  .icon-mssage {
    position: absolute;
    z-index: 2;
    width: 67px;
    height: 47px;
    background: url('~assets/themeMix/msglist-normal.jpg') no-repeat right;
    left: 17px;
    top: 30px;
  }
}
.null {
  padding: 20px;
}
</style>
