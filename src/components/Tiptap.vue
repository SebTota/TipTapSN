<template>
  <div class="editor" v-if="editor">
    <button @click="setupWebrtc">Share Document Live</button>
    <button @click="connectWebrtc">Connect</button>
    <button @click="disconnectWebrtc">Disconnect</button>
    <menu-bar class="editor__header" :editor="editor" />
    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import { EditorContent } from "@tiptap/vue-2";
// import StarterKit from '@tiptap/starter-kit'
import { Editor } from "@tiptap/core";

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
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"
import Code from "@tiptap/extension-code"
import CodeBlock from '@tiptap/extension-code-block'
import HardBreak from "@tiptap/extension-hard-break"
import Heading from "@tiptap/extension-heading"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import Bold from "@tiptap/extension-bold"
import Italics from "@tiptap/extension-italic"
import Strike from "@tiptap/extension-strike"

// Standard Notes
import EditorKit from "@standardnotes/editor-kit";

import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import MenuBar from "./MenuBar.vue";

export default {
  components: {
    EditorContent,
    MenuBar,
  },

  data() {
    return {
      editor: null,
    };
  },

  methods: {
    /* 
    * Boiler plate for adding images to the editor
    */
    addImage() {
      const url = window.prompt("URL");
      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run();
      }
    },

    /*
    * Generate a random ID of a specified length
    */
    makeid(length) {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },

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
          this.editor.commands.setContent(text);
        },
        // getCurrentLineText: () => {},
        // getPreviousLineText: () => {},
        // replaceText: ({ regex, replacement, previousLine }) => {},
        // getElementsBySelector: (selector) => {},
        // insertElement: (element, inVicinityOfElement, insertionType) => {},
        // preprocessElement: (element) => {},
        clearUndoHistory: () => {
          this.resetEditor();
        },
        onNoteLockToggle: (isLocked) => {this.editor.setEditable(!isLocked)},
        onNoteValueChange: (note) => {
          if (this.note_uuid !== null) { this.resetEditor() }  // Need this to close the collaborative editing
          this.note_uuid = note.uuid;
        },
      };

      this.editorKit = new EditorKit(delegate, {
        mode: "html",
        supportsFileSafe: false,
      });

      this.editorKit.getFileSafe().then((filesafeInstance) => {
        // this.componentRelay is not initalized until onNoteValueChange() is called for the first time
        // DO NOT access it here
        this.componentRelay = filesafeInstance['extensionBridge']['componentManager']
      })
    },

    resetEditor() {
      this.editor.off(this.onEditorUpdate)
      this.editor.destroy()
      this.configureEditor(false)
    },

    configureEditor(webrtcEnabled) {
      let documentName = this.makeid(32);
      let documentPassword = this.makeid(32);

      let editorText = null;
      if (this.editor) {
        editorText = this.editor.getHTML();
        this.editor.off(this.onEditorUpdate)
      }

      const params = new URLSearchParams(window.location.search);

      if (params.get("documentName") && params.get("documentPassword")) {
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
        this.ydoc = new Y.Doc();
        const url = `http://localhost:8080/?documentName=${documentName}&documentPassword=${documentPassword}`
        
        // Do not show the sharing URL to clients, only to the host
        if (url !== window.location.href) {
          // Host
          this.isWebrtcHost = true
          console.log(url)
          alert(url)
        } else {
          // Client
          this.isWebrtcHost = false
        }

        this.provider = new WebrtcProvider(documentName, this.ydoc, {
          password: documentPassword,
        });

          /*
          * WebRTC clients (non-hosts) should remember the hosts unique ID to determine when the host has left the room.
          * On each subsequent `peers` event, they should check to see if that unique ID has left. If so, the host has left the room.
          */
        this.provider.on('peers', (data) => {
          console.log('peers')
          const removed = data['removed']
          //const added = data['addeed']
          const webrtcPeers = data['webrtcPeers']
          //const bcPeers = data['bcPeers']
         
          if (!this.isWebrtcHost && this.webrtcHostId === undefined) {
            // Client has just joined
            this.webrtcHostId = webrtcPeers[0]  
          } else if (!this.isWebrtcHost) {
            // Client should check if host has left
            if (removed.includes(this.webrtcHostId)) {
              this.editor.setEditable(false);
              alert('Host disconnected. Document is no longer editable.')
            }
          }
        })

        extensions.push(
          Collaboration.configure({
            document: this.ydoc,
          })
        );

        extensions.push(
          CollaborationCursor.configure({
            provider: this.provider,
            user: {
              name: "Test User",
              color: "#" + Math.floor(Math.random() * 16777215).toString(16),
            },
          })
        );
      }

      this.editor = new Editor({
        extensions: extensions,
        autofocus: true,
      });
      window.editor = this.editor;
      this.editor.on('update', this.onEditorUpdate)

      if (editorText) {
        this.editor.commands.setContent(editorText);
      }
    },

    setupWebrtc() {
      if (this.provider) this.provider.destroy();
      this.editor.destroy();
      this.configureEditor(true);
    },

    disconnectWebrtc() {
      this.provider.disconnect();
    },

    connectWebrtc() {
      this.provider.connect();
    }
  },

  mounted() {
    this.configureEditorKit();
    this.configureEditor(false);
  },

  beforeDestroy() {
    this.editor.destroy();
    this.provider.destroy();
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

