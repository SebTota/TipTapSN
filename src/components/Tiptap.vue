<template>
  <div class="editor" v-if="editor">
    <menu-bar class="editor__header" :editor="editor" :tiptap="tiptap"/>
    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import { EditorContent } from "@tiptap/vue-2";
import { Editor } from "@tiptap/core";
import Hisotry from "@tiptap/extension-history";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Dropcursor from "@tiptap/extension-dropcursor";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Bold from "@tiptap/extension-bold";
import Italics from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";

// Standard Notes
import EditorKit from "@standardnotes/editor-kit";

import MenuBar from "./MenuBar.vue";
import WebrtcBridge from './WebrtcBridge.js'

export default {
  components: {
    EditorContent,
    MenuBar,
  },

  data() {
    return {
      tiptap: undefined,
      editor: null,
      editorKit: null,
      note_uuid: undefined,
      skipInsertRawText: false,
      webrtcBridge: undefined
    };
  },

  methods: {
    /*
     * Event handler for when an update occurs on the editor
     */
    onEditorUpdate() {
      this.editorKit.onEditorValueChanged(this.editor.getHTML());
    },

    configureEditorKit() {
      const delegate = {
        // insertRawText: (text) => {},
        setEditorRawText: (text) => {
          console.log("set text");
          if (this.skipInsertRawText) {
            this.skipInsertRawText = false;
            return;
          }
          this.editor.commands.setContent(text);
        },
        // getCurrentLineText: () => {},
        // getPreviousLineText: () => {},
        // replaceText: ({ regex, replacement, previousLine }) => {},
        // getElementsBySelector: (selector) => {},
        // insertElement: (element, inVicinityOfElement, insertionType) => {},
        // preprocessElement: (element) => {},
        clearUndoHistory: () => {
          this.configureEditor();
        },
        onNoteLockToggle: (isLocked) => {
          this.editor.setEditable(!isLocked);
        },
        onNoteValueChange: (note) => {
          if (this.note_uuid === undefined) {
            /*
             * Editor initalized
             */
            this.note_uuid = note.uuid;
          } else if (this.note_uuid === note["uuid"]) {
            /*
             * This is needed because a note change is triggered when a user clicks on 'Extensions'
             * causing the focus to shit back to the editor and the Extension tab never has a chance
             * to open.
             */
            this.skipInsertRawText = true;
          } else {
            /*
             * Handle user switching note while sharing a different note live.
             * Fixes issue where the new note content is shared with conected peers.
             */
            this.note_uuid = note.uuid; // Set new note uuid
            this.configureEditor(); // Reset editor to remove colab session
          }
        },
      };

      this.editorKit = new EditorKit(delegate, {
        mode: "html",
        supportsFileSafe: false,
      });
    },

    /*
    * Present the meeting URL to host
    */
    presentSharingUrl() {
      console.log(this.webrtcBridge.getShareUrl())
    },

    presentSharingDisconnected() {
      console.log('Disonnected from WebRTC')
    },

    presentSharingNotStarted() {
      console.log('Sharing was already disabled')
    },

    configureEditor(webrtcEnabled=false) {
      let editorText = null;
      if (this.editor) {
        editorText = this.editor.getHTML();
        this.editor.off(this.onEditorUpdate);
        this.editor.destroy();
        if (this.webrtcBridge) this.webrtcBridge.disconnectWebrtc();
        this.webrtcBridge = undefined;
      }

      const params = new URLSearchParams(window.location.search);

      let documentName;
      let documentPassword;
      if (params.has("joinSharedSession") && params.get("joinSharedSession") === "true") {
        webrtcEnabled = true;
        documentName = params.get("documentName");
        documentPassword = params.get("documentPassword");
      }

      let extensions = [
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
                keepOnSplit: false,
              },
            };
          },
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
        Blockquote,
        BulletList,
        OrderedList,
        ListItem,
        Code,
        CodeBlock,
        HardBreak,
        Heading,
        HorizontalRule,
        Bold,
        Italics,
        Strike,
      ];

      if (webrtcEnabled) {
        this.webrtcBridge = new WebrtcBridge(documentName, documentPassword)

        this.webrtcBridge.waitToConnect().then(() => {
          this.presentSharingUrl()
        })

        extensions.push(
          Collaboration.configure({
            document: this.webrtcBridge.ydoc,
          })
        );

        extensions.push(
          CollaborationCursor.configure({
            provider: this.webrtcBridge.provider,
            user: {
              name: "Test User",
              color: "#" + Math.floor(Math.random() * 16777215).toString(16),
            },
          })
        );
      } else {
        extensions.push(Hisotry);
      }

      this.tiptap = this;
      this.editor = new Editor({
        extensions: extensions,
        autofocus: true,
      });
      this.editor.on("update", this.onEditorUpdate);

      if (editorText) {
        this.editor.commands.setContent(editorText);
      }
    },

    setupWebrtc() {
      if (this.webrtcBridge && this.webrtcBridge.provider && this.editor) {
         this.presentSharingUrl()
      } else {
        this.configureEditor(true);  
      }
    },

    disconnectWebrtc() {
      if (this.webrtcBridge) this.webrtcBridge.disconnectWebrtc();
      this.presentSharingDisconnected()
      this.configureEditor();
    },

    webrtcConnected() {
      if (this.webrtcBridge) return this.webrtcBridge.isConnectedWebrtc();
      else return false
    },
  },

  mounted() {
    this.tiptap = this;
    this.configureEditorKit();
    this.configureEditor();
  },

  beforeDestroy() {
    if (this.webrtcBridge && this.webrtcBridge.provider) this.webrtcBridge.provider.destroy();
    this.editor.destroy();
  },
};
</script>

<style lang="scss" scoped>
.editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #0d0d0d;
  &__header {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
    border-bottom: 3px solid #0d0d0d;
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
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
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
  color: #0d0d0d;
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
    background: #0d0d0d;
    color: #fff;
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
    }
  }

  mark {
    background-color: #faf594;
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
    border-left: 2px solid rgba(#0d0d0d, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
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
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
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

