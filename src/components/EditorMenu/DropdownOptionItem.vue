<template>
  <a v-if="isRendered()"
    class="dropdown-item"
    @click="action"
    :title="title"
  >
  {{title}}
  </a>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },

    action: {
      type: Function,
      default: () => {},
    },

    isRendered: {
      type: Function,
      default: () => {return true}
    }
  },
}
</script>

<style>
.dropdown-item {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-item:hover {
  background-color: #ddd;
}
</style>