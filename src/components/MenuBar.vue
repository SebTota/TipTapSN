<template>
  <div class="menu-bar">
    <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
      Bold
    </button>
    <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
      Italic
    </button>
    <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
      Strike
    </button>
    <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
      Paragraph
    </button>
    <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
      H1
    </button>
    <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
      H2
    </button>
    <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
      Bullet List
    </button>
    <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
      Ordered List
    </button>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3'

interface Props {
  editor: Editor
}

defineProps<Props>()
</script>

<style lang="scss" scoped>
.menu-bar {
  display: flex;
  flex-wrap: wrap;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;

  button {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;

    &.is-active {
      background: #eee;
    }

    &:hover {
      background: #f0f0f0;
    }
  }
}
</style>
