<template>
  <div class="editor">
    <menu-bar v-if="editor" :editor="editor" />
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent } from '@tiptap/vue-3'
import MenuBar from './MenuBar.vue'

const editor = ref<Editor | null>(null)

onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit],
    content: '<p>Hello, World!</p>',
    autofocus: true,
    editable: true,
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style lang="scss" scoped>
.editor {
  display: flex;
  flex-direction: column;
  max-height: 100%;

  :deep(.ProseMirror) {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
}
</style>
