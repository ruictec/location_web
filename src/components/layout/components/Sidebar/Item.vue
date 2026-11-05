<template>
  <span class="menu-item-inner">
    <i v-if="icon && icon.includes('el-icon')" :class="[icon, 'sub-el-icon']" />
    <img v-else-if="icon" :src="iconSrc" />
    <span v-if="title">{{ title }}</span>
  </span>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconSrc() {
      return this.icon ? new URL(`../../../../assets/${this.icon}`, import.meta.url).href : ''
    }
  }
}
</script>

<style scoped>
.menu-item-inner {
  display: inline-flex;
  align-items: center;
}
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
