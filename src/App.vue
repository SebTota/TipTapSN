<template>
  <div id="app">
    <tiptap />
  </div>
</template>
<style src='sn-stylekit/dist/stylekit.css'></style>
<style>
@font-face {
  font-family: 'Lato';
  src: url('../public/assets/fonts/Lato/Lato-Regular.woff') format('woff'), /* Modern Browsers */
       url('../public/assets/fonts/Lato/Lato-Regular.ttf')  format('truetype'), /* Safari, Android, iOS */
}
</style>

<script>
import Tiptap from './components/Tiptap.vue'

export default {
  name: 'App',
  components: {
    Tiptap
  }
}
</script>