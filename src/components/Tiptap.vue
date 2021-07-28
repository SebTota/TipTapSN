
<template>
  <div class="editor" v-if="editor">
    <button @click="addImage">
      add image from URL
    </button>
    <menu-bar class="editor__header" :editor="editor" />
    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import { EditorContent } from '@tiptap/vue-2'
// import StarterKit from '@tiptap/starter-kit'
import { Editor } from '@tiptap/core'

import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Dropcursor from '@tiptap/extension-dropcursor'

import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Highlight from '@tiptap/extension-highlight'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Image from '@tiptap/extension-image'

import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import MenuBar from './MenuBar.vue'

export default {
  components: {
    EditorContent,
    MenuBar
  },

  data() {
    return {
      editor: null,
    }
  },

  methods: {
    addImage() {
      const url = window.prompt('URL')
      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run()
      }
    },
  },

  mounted() {
    this.ydoc = new Y.Doc()
    this.provider = new WebrtcProvider('example-document', this.ydoc)

    this.editor = new Editor({
      extensions: [
        // StarterKit.configure({
        //   history: false,
        //   dropcuror: true,
        //   gapcursor: true
        // }),
        Collaboration.configure({
            document: this.ydoc,
        }),
        CollaborationCursor.configure({
            provider: this.provider,
            user: {
              name: 'Cyndi Lauper',
              color: '#'+Math.floor(Math.random()*16777215).toString(16),
            },
        }),
        Table.configure({
          resizable: true,
        }),
        Document,
        Paragraph.extend({
          addAttributes() {
            return {
              testAttr: {
                ...this.parent?.(),
                default: null,
                keepOnSplit: false
              }
            }
          }
        }),
        Text,
        Image,
        Dropcursor,
        TableRow,
        TableHeader,
        TableCell,
        Highlight,
        TaskList,
        TaskItem,
      ],
      autofocus: true,
    })
    window.editor = this.editor
  },

  beforeDestroy() {
    this.editor.destroy()
    this.provider.destroy()
  },
}
</script>

<style lang="scss" scoped>
.editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #0D0D0D;
  &__header {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
    border-bottom: 3px solid #0D0D0D;
  }
  &__content {
    padding: 16px 18px;
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}
</style>

<style lang="scss">
html {
  height: 100%;
}

body {
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
}

.ProseMirror {
  outline: 0;
  height: calc(100% - 32px);
}
.ProseMirror ul[data-type="taskList"] li div p {
  margin-top: 8px;
  margin-bottom: 8px;
}
/* Give a remote user a caret */
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0D0D0D;
  border-right: 1px solid #0D0D0D;
  word-break: normal;
  pointer-events: none;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0D0D0D;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}

/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  mark {
    background-color: #FAF594;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  hr {
    margin: 1rem 0;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }

  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
      }
    }
  }
}

/* Table-specific styling */
.ProseMirror {
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0; right: 0; top: 0; bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }
  }
}

.tableWrapper {
  overflow-x: auto;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
</style>