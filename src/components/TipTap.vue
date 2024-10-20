<template>
  <div class="editor">
    <menu-bar v-if="editor" :editor="editor" />
    <editor-content v-if="editor" :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { shallowRef, onMounted, onBeforeUnmount, watch } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import MenuBar from "./MenuBar.vue";
import { getEditorExtensions } from "@/utils/editorConfig";

const props = defineProps<{
  initialContent: string;
}>();

const editor = shallowRef<Editor | null>(null);

onMounted(() => {
  editor.value = new Editor({
    extensions: getEditorExtensions(),
    content: "<p>Hello, World!</p>",
    autofocus: true,
    editable: true,
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      console.log("Content updated:", htmlContent);
    },
  });
});

watch(
  () => props.initialContent,
  (newContent) => {
    if (editor.value && newContent !== editor.value.getHTML()) {
      editor.value.commands.setContent(newContent, false);
    }
  },
);

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
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
