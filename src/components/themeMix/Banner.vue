<template lang="pug">
.banner
  Carousel(v-model="index" :loop="isTrue" :autoplay="isTrue" :autoplay-speed="autoplayspeed")
    CarouselItem(v-for="(item, index) in list" :key="index")
      a.banner-img(:href="item.url" target="_self" :style="{backgroundImage: `url(${item.src})`}")
</template>

<script>
import { newsApi } from 'api';

export default {
  name: 'Banner',
  props: ['speed'],
  data () {
    return {
      index: 0,
      list: []
    }
  },
  computed: {
    isTrue() {
      return this.list.length != 1;
    },
    autoplayspeed() {
      return this.speed || 4000;
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      newsApi.banner().then(data => {
        if (data.code != 0) return this.notice(data.msg, 'warning')
        this.list = data.list
      })
    },
    notice (msg, type) {
      this.$Message[type](msg)
    }
  }
}
</script>

<style lang="scss" scoped>
.banner,
.banner-img {
  overflow: hidden;
  display: block;
  width: 100%;
  height: 310px;
  background: #eee center no-repeat;
}
.theme2 .banner,
.theme2 .banner-img,
.theme4 .banner,
.theme4 .banner-img {
  width: 100%;
  height: 400px;
}
</style>