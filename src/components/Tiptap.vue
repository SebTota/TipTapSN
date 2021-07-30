<template>
  <div class="editor" v-if="editor">
    <button @click="setupWebrtc">Share Document Live</button>
    <button @click="disconnectWebrtc">Disconnect</button>
    <menu-bar class="editor__header" :editor="editor" :tiptap="tiptap" />
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
      tiptap: null,
      editor: null,
      editorKit: null,
      note_uuid: undefined,
      skipInsertRawText: false,
      ydoc: undefined,
      provider: undefined,
      isWebrtcHost: undefined,
      webrtcHostId: undefined,
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
     * Generate a random string of a specified length
     * @param   Int     The requested length of the random string
     * @return  String  A random string of a specified length
     */
    makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
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

    /*
     * Get the current users Webrtc Peer ID
     * @Return string  Webrtc Peer ID
     */
    getWebrtcPeerId() {
      if (!this.provider) return undefined;
      return this.provider.room.peerId;
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
          this.resetEditor();
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
            this.resetEditor(); // Reset editor to remove colab session
          }
        },
      };

      this.editorKit = new EditorKit(delegate, {
        mode: "html",
        supportsFileSafe: false,
      });
    },

    resetEditor() {
      this.editor.off(this.onEditorUpdate);
      this.editor.destroy();
      this.configureEditor(false);
    },

    /*
    * Event handler used to listen for new data events that contain the hosts WebRTC userId.
    * It is necessary to know the hosts userId to know when the host has disconnected from the room.
    */
    webrtcHostIdMessageListener(message) {
      try {
              const jsonMessage = JSON.parse(message);
              if ("roomHostId" in jsonMessage) {
                this.webrtcHostId = jsonMessage["roomHostId"];
                console.log(`Received room host id: ${this.webrtcHostId}`);
              }
            } catch (_) {
              _;
            }
    },

    /*
    * Event handles used to keep track of users in the webRTC room and to make sure all the users know who the host is
    */
    peerChangeEventHandler(data) {
      console.log("peers");
      const removed = data["removed"];
      const added = data["added"];
      // const webrtcPeers = data["webrtcPeers"];
      //const bcPeers = data['bcPeers']

      for (let i = 0; i < added.length; i++) {
        const rtcId = added[i];
        const rtcConns = this.provider["room"]["webrtcConns"];

        /*
        * Client only (not host): Listen for messages to determine which user inside of the room is the host
        */
        if (this.webrtcHostId === undefined) {
          console.log("Listening for host id message");
          rtcConns.get(rtcId).peer.on("data", this.webrtcHostIdMessageListener);
        }

        rtcConns.get(rtcId).peer.on("connect", () => {
          /*
           * Send a message to the new user containing the meetings host's hostId
           */
          console.log("New user has connected");
          if (this.webrtcHostId !== undefined) {
            console.log(`Sending hostId to new user`);
            rtcConns
              .get(rtcId)
              .peer.send(JSON.stringify({ roomHostId: this.webrtcHostId }));
          }
        });
      }

      /*
      * Client only (not host): Every time a user leaves the room, check to make sure it is not the host who has left. 
      */
      if (!this.isWebrtcHost) {
        if (removed.includes(this.webrtcHostId)) {
          this.editor.setEditable(false);
          alert("Host disconnected. Document is no longer editable.");
        }
      }
    },

    /*
    * Present the meeting URL to host
    */
    presentSharingUrl(url) {
      console.log(url)
    },

    configureEditor(webrtcEnabled) {
      let documentName = this.makeid(64);
      let documentPassword = this.makeid(64);

      const params = new URLSearchParams(window.location.search);
      this.isWebrtcHost = !(
        params.has("joinSharedSession") &&
        params.get("joinSharedSession") === "true"
      );

      if (
        params.has("joinSharedSession") &&
        params.get("joinSharedSession") === "true"
      ) {
        webrtcEnabled = true;
        documentName = params.get("documentName");
        documentPassword = params.get("documentPassword");
      }

      let editorText = null;
      if (this.editor) {
        editorText = this.editor.getHTML();
        this.editor.off(this.onEditorUpdate); // Remove any previously initalized event handlers
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
        const url = `https://sebtota.github.io/TipTapSN/?joinSharedSession=true&documentName=${documentName}&documentPassword=${documentPassword}`;

        this.provider = new WebrtcProvider(documentName, this.ydoc, {
          password: documentPassword,
        });

        /*
         * TODO: There must be a better way of checking this. Wait until the current client has connected to the WebRTC room.
         */
        // eslint-disable-next-line no-inner-declarations
        const waitToConnect = () => {
          if (this.provider.connected === false) {
            console.log("waiting to connect to WebRTC room");
            window.setTimeout(
              waitToConnect,
              100
            ); /* this checks the flag every 100 milliseconds*/
          } else {
            // User connected to room
            if (this.isWebrtcHost) {
              this.webrtcHostId = this.provider["room"]["peerId"];  // Set the hostId to the current users id
              this.presentSharingUrl(url) // Present the sharing URL to invite others
            }

            /*
             * WebRTC clients (non-hosts) should remember the hosts unique ID to determine when the host has left the room.
             * On each subsequent `peers` event, they should check to see if that unique ID has left. If so, the host has left the room.
             */
            this.provider.on("peers", this.peerChangeEventHandler);
          }
        };
        waitToConnect();

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
      if (this.provider) this.provider.destroy();
      if (this.editor) this.editor.destroy();
      this.configureEditor(true);
    },

    isConnectedWebrtc() {
      if (this.provider === undefined) return false;
      return this.provider.connected;
    },

    disconnectWebrtc() {
      if (this.provider) this.provider.destroy();
    },
  },

  mounted() {
    this.configureEditorKit();
    this.configureEditor(false);
  },

  beforeDestroy() {
    this.editor.destroy();
    if (this.provider) this.provider.destroy();
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

