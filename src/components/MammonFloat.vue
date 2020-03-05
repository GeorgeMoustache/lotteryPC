<template lang="pug">
.cartoon(v-if="show")
  Icon.icon(type="ios-close" size="20" @click.native="show = false")
  router-link(to="/redRain")
    img(src="@/assets/redRain/mammonFloat.gif")
</template>

<script>
export default {
  name: "MammonFloat",
  data() {
    return {
      show: true
    };
  }
};
</script>

<style lang="scss" scoped>
.cartoon {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  .icon {
    position: absolute;
    top: 0;
    right: 0;
    color: $primary-color;
  }
  img {
    width: 120px;
    height: auto;
  }
}
</style>
