/* eslint-disable vue/no-unused-vars */
<template>
  <div>
    <template v-for="(item, index) in items">
      <div class="divider" v-if="item.type === 'divider'" :key="index" />
      <!-- <template v-else-if="item.type === 'dropdown'">
        <template v-for="(dropdownItem, dropdownIndex) in item.items">
          <a :key="dropdownIndex">testabc123</a>
        </template>
      </template> -->
      <menu-item v-else :key="index" v-bind="item" />
    </template>
  </div>
</template>

<script>
import MenuItem from './MenuItem.vue'
export default {
  components: {
    MenuItem,
  },
  props: {
    editor: {
      type: Object,
      required: true,
    },
    tiptap: {
      type: Object,
      required: true
    },
    webrtcBridge: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      items: [
        {
          icon: 'bold',
          title: 'Bold',
          action: () => this.editor.chain().focus().toggleBold().run(),
          isActive: () => this.editor.isActive('bold'),
        },
        {
          icon: 'italic',
          title: 'Italic',
          action: () => this.editor.chain().focus().toggleItalic().run(),
          isActive: () => this.editor.isActive('italic'),
        },
        {
          icon: 'strikethrough',
          title: 'Strike',
          action: () => this.editor.chain().focus().toggleStrike().run(),
          isActive: () => this.editor.isActive('strike'),
        },
        {
          icon: 'mark-pen-line',
          title: 'Highlight',
          action: () => this.editor.chain().focus().toggleHighlight().run(),
          isActive: () => this.editor.isActive('highlight'),
        },
        {
          icon: 'paragraph',
          title: 'Paragraph',
          action: () => this.editor.chain().focus().setParagraph().run(),
          isActive: () => this.editor.isActive('paragraph'),
        },
        {
          type: 'divider',
        },
        {
          icon: 'code-view',
          title: 'Code',
          action: () => this.editor.chain().focus().toggleCode().run(),
          isActive: () => this.editor.isActive('code'),
        },
        {
          icon: 'code-box-line',
          title: 'Code Block',
          action: () => this.editor.chain().focus().toggleCodeBlock().run(),
          isActive: () => this.editor.isActive('codeBlock'),
        },
        {
          icon: 'double-quotes-l',
          title: 'Blockquote',
          action: () => this.editor.chain().focus().toggleBlockquote().run(),
          isActive: () => this.editor.isActive('blockquote'),
        },
        {
          icon: 'table-2',
          title: 'Table',
          type: 'dropdown',
          action: () => {},
          dropdownOptions: [
            {
              title: 'Insert Table',
              action: () => { this.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() }
            },
            {
              title: 'Add Column Before',
              action: () => { this.editor.chain().focus().addColumnBefore().run() },
              isRendered: () => { return this.editor.can().addColumnBefore() }
            },
            {
              title: 'Add Column After',
              action: () => { this.editor.chain().focus().addColumnAfter().run() },
              isRendered: () => { return this.editor.can().addColumnAfter() }
            },
            {
              title: 'Delete Column',
              action: () => { this.editor.chain().focus().deleteColumn().run() },
              isRendered: () => { return this.editor.can().deleteColumn() }
            },
            {
              title: 'Add Row Before',
              action: () => { this.editor.chain().focus().addRowBefore().run() },
              isRendered: () => { return this.editor.can().addRowBefore() }
            },
            {
              title: 'Add Row After',
              action: () => { this.editor.chain().focus().addRowAfter().run() },
              isRendered: () => { return this.editor.can().addRowAfter() }
            },
            {
              title: 'Delete Row',
              action: () => { this.editor.chain().focus().deleteRow().run() },
              isRendered: () => { return this.editor.can().deleteRow() }
            },
            {
              title: 'Toggle Header Column',
              action: () => { this.editor.chain().focus().toggleHeaderColumn().run() },
              isRendered: () => { return this.editor.can().toggleHeaderColumn() }
            },
            {
              title: 'Toggle Header Row',
              action: () => { this.editor.chain().focus().toggleHeaderRow().run() },
              isRendered: () => { return this.editor.can().toggleHeaderRow() }
            },
            {
              title: 'Merge Cells',
              action: () => { this.editor.chain().focus().mergeCells().run() },
              isRendered: () => { return this.editor.can().mergeCells() }
            },
            {
              title: 'Split Cell',
              action: () => { this.editor.chain().focus().splitCell().run() },
              isRendered: () => { return this.editor.can().splitCell() }
            },
            {
              title: 'Delete Table',
              action: () => { this.editor.chain().focus().deleteTable().run() },
              isRendered: () => { return this.editor.can().deleteTable() }
            },
          ]
        },
        {
          type: 'divider',
        },
        {
          icon: 'h-1',
          title: 'Heading 1',
          action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 1 }),
        },
        {
          icon: 'h-2',
          title: 'Heading 2',
          action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 2 }),
        },
        {
          icon: 'list-unordered',
          title: 'Bullet List',
          action: () => this.editor.chain().focus().toggleBulletList().run(),
          isActive: () => this.editor.isActive('bulletList'),
        },
        {
          icon: 'list-ordered',
          title: 'Ordered List',
          action: () => this.editor.chain().focus().toggleOrderedList().run(),
          isActive: () => this.editor.isActive('orderedList'),
        },
        {
          icon: 'list-check-2',
          title: 'Task List',
          action: () => this.editor.chain().focus().toggleTaskList().run(),
          isActive: () => this.editor.isActive('taskList'),
        },
        {
          type: 'divider',
        },
        {
          icon: 'text-wrap',
          title: 'Hard Break',
          action: () => this.editor.chain().focus().setHardBreak().run(),
        },
        {
          icon: 'format-clear',
          title: 'Clear Format',
          action: () => this.editor.chain()
            .focus()
            .clearNodes()
            .unsetAllMarks()
            .run(),
        },
        {
          type: 'divider',
        },
        {
          icon: 'file-cloud-line',
          title: 'Share Note',
          action: () => { this.tiptap.setupWebrtc() },
          isRendered: () => {  return !this.tiptap.isWebrtcConnected() },
        },
        {
          icon: 'file-lock-line',
          title: 'Disconnect',
          action: () => { this.tiptap.disconnectWebrtc() },
          isRendered: () => {  return this.tiptap.isWebrtcConnected() && this.webrtcBridge && this.webrtcBridge.isHost() },
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.divider {
  width: 2px;
  height: 1.25rem;
  background-color: var(--sn-stylekit-neutral-contrast-color);
  margin-left: 0.5rem;
  margin-right: 0.75rem;
}
</style>

<style lang="scss">
.menu-item {
  color: var(--sn-stylekit-foreground-color);
}
.menu-item .is-active {
  color: var(--sn-stylekit-background-color);
}
</style>