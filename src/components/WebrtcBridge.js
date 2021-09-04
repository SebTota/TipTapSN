import { WebrtcProvider } from "y-webrtc";

import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

import { htmlToYdoc } from "./Static/htmlToYdoc";

export default class WebrtcBridge {
  constructor(documentName = undefined, documentPassword = undefined, hostId = undefined, html = null) {
    this.ydoc = null;
    this.provider = null;
    this.isWebrtcHost = false;
    this.webrtcHostId = hostId;
    this.shareUrl = "";
    this.users = [];
    this.user = {
      name: "User",
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    }
    this.document = {
      name: documentName,
      password: documentPassword
    }

    const params = new URLSearchParams(window.location.search);
    this.isWebrtcHost = !(
      params.has("joinSharedSession") &&
      params.get("joinSharedSession") === "true"
    );

    // Create a room name and password if one was not already set
    if (!(this.document['name'] && this.document['password'])) {
      this.document['name'] = this.makeid(64);
      this.document['password'] = this.makeid(64);
    }

    this.ydoc = htmlToYdoc(html);

    this.provider = new WebrtcProvider(this.document['name'], this.ydoc, {
      password: this.document['password'],
    });
  }

  getExtensions() {
    return [
      Collaboration.configure({
        document: this.ydoc,
        field: "prosemirror"
      }),

      CollaborationCursor.configure({
        provider: this.provider,
        user: this.user,
        onUpdate: (users) => {
          this.users = users;
        },
      }),
    ];
  }

  getConnectedUsers() {
    return this.users;
  }

  getUser() {
    return this.user
  }

  getShareUrl() {
    return this.shareUrl;
  }

  getUserName() {
    return this.user['name'];
  }

  changeName(name) {
    this.user['name'] = name;
  }

  isHost() {
    return this.isWebrtcHost;
  }
  
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
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /*
   * Get the current users Webrtc Peer ID
   * @Return string  Webrtc Peer ID
   */
  getWebrtcPeerId() {
    if (!this.provider) return undefined;
    return this.provider.room.peerId;
  }

    /*
   * Event handles used to keep track of users in the webRTC room and to make sure all the users know who the host is
   */
    peerChangeEventHandler({removed, added, webrtcPeers, bcPeers}) {
      added; webrtcPeers; bcPeers;
      /*
       * Client only (not host): Every time a user leaves the room, check to make sure it is not the host who has left.
       */
      if (!this.isWebrtcHost && removed.includes(this.webrtcHostId)) {
          alert(
            "Host disconnected. Document is no longer being saved by the host."
          );
        }
    }

  /*
   * TODO: There must be a better way of checking this. Wait until the current client has connected to the WebRTC room.
   */
  waitToConnect() {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve, _) => {
      var _interval = setInterval(() => {
        if (this.provider.connected === false) {
          console.log("Waiting to connect to WebRTC room");
        } else {
          console.log("Connected to WebRTC room");
          if (this.isWebrtcHost) this.webrtcHostId = this.provider["room"]["peerId"];
          this.shareUrl = `https://sebtota.github.io/TipTapSN/?joinSharedSession=true&documentName=${this.document['name']}&documentPassword=${this.document['password']}&hostId=${this.webrtcHostId}`;
          /*
           * WebRTC clients (non-hosts) should remember the hosts unique ID to determine when the host has left the room.
           * On each subsequent `peers` event, they should check to see if that unique ID has left. If so, the host has left the room.
           */
          this.provider.on("peers", (data) =>
            this.peerChangeEventHandler(data)
          );
          clearInterval(_interval);
          resolve();
        }
      }, 100);
    });
  }

  isConnectedWebrtc() {
    if (!this.provider) return false;
    return this.provider.connected;
  }

  disconnectWebrtc() {
    if (this.provider) {
      this.provider.disconnect();
      this.provider.destroy();
    }
  }
}
