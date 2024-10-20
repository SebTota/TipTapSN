<template>
  <div class="menu-bar">
    <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
      <i class="ri-bold"></i>
    </button>
    <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
      <i class="ri-italic"></i>
    </button>
    <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
      <i class="ri-strikethrough"></i>
    </button>
    <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
      <i class="ri-code-line"></i>
    </button>
    <button @click="editor.chain().focus().toggleHighlight().run()" :class="{ 'is-active': editor.isActive('highlight') }">
      <i class="ri-mark-pen-line"></i>
    </button>
    <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
      <i class="ri-paragraph"></i>
    </button>
    <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
      <i class="ri-h-1"></i>
    </button>
    <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
      <i class="ri-h-2"></i>
    </button>
    <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
      <i class="ri-list-unordered"></i>
    </button>
    <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
      <i class="ri-list-ordered"></i>
    </button>
    <button @click="editor.chain().focus().toggleTaskList().run()" :class="{ 'is-active': editor.isActive('taskList') }">
      <i class="ri-task-line"></i>
    </button>
    <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
      <i class="ri-code-box-line"></i>
    </button>
    <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
      <i class="ri-double-quotes-l"></i>
    </button>
    <button @click="editor.chain().focus().setHorizontalRule().run()">
      <i class="ri-separator"></i>
    </button>
    <button @click="editor.chain().focus().setHardBreak().run()">
      <i class="ri-text-wrap"></i>
    </button>
    <button @click="editor.chain().focus().undo().run()">
      <i class="ri-arrow-go-back-line"></i>
    </button>
    <button @click="editor.chain().focus().redo().run()">
      <i class="ri-arrow-go-forward-line"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/vue-3'

interface Props {
  editor: Editor
}

const props = defineProps<Props>()
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
    padding: 0.25rem;
    border: 1px solid #ccc;
    background: white;
    cursor: pointer;
    border-radius: 3px;
    font-size: 0.9rem;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.is-active {
      background: #eee;
    }

    &:hover {
      background: #f0f0f0;
    }

    i {
      font-size: 1.2rem;
    }
  }
}
</style>
