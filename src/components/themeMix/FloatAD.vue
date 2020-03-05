<template lang="pug">
.float-model
  .left(v-show="leftOpen")
    img.qrcode(:src="appConfig.Ios2code")
    router-link.btn(to="/promotion")
    a.btn(:href="appConfig.serviceUrl" target="_blank")
    a.close(@click="leftOpen = false")
  .right(v-show="rightOpen")
    img.qrcode(:src="appConfig.Android2code")
    a.btn(v-for="(n, i) in QQRight" :href="`http://wpa.qq.com/msgrd?v=3&uin=${n}&site=qq&menu=yes`" target="_blank")
    a.close(@click="rightOpen = false")
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'FloatAD',
  data () {
    return {
      leftOpen: true,
      rightOpen: true,
    }
  },
	computed: {
    ...mapGetters(['appConfig']),
    QQRight() {
      const { QQRight } = this.appConfig;
      return QQRight ? QQRight.split(',') : '';
    }
  }
}
</script>

<style lang="scss" scoped>
.left,
.right {
  position: fixed;
  top: 50%;
  width: 120px;
  height: 300px;
  margin-top: -150px;
  padding-top: 75px;
  z-index: 20;
  img {
    display: block;
    width: 95px;
    height: auto;
    margin: 0 auto 15px auto;
  }
  a {
    display: block;
  }
  .btn {
    width: 110px;
    height: 40px;
    margin: 0 auto 7px auto;
  }
  .close {
    position: absolute;
    bottom: 3px;
    left: 32px;
    width: 56px;
    height: 15px;
  }
}
.left {
  left: 0;
  background: url('~assets/themeMix/door-left.png')
}
.right {
  right: 0;
  background: url('~assets/themeMix/door-right.png')
}
</style>
