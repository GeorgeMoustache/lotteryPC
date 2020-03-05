<template lang="pug">
Index
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Index',
  computed: {
    ...mapGetters(['appConfig']),
  },
  created() {
    this.fetchIndexComponents();
  },
  methods: {
    fetchIndexComponents() {
      let themeIndex = this.appConfig.themeName.split('theme')[1];
      this.$options.components.Index = () => {
        return import(`./Index${themeIndex}`)
      }
    }
  }
}
</script>