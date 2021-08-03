import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";

// eslint-disable-next-line no-unused-vars
export default class WebrtcBridge {
  constructor(documentName = undefined, documentPassword = undefined) {
    this.ydoc = null;
    this.provider = null;
    this.isWebrtcHost = false;
    this.webrtcHostId = "";
    this.shareUrl = "";
    this.users = [];
    this.user = {
      name: "User",
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    }

    const params = new URLSearchParams(window.location.search);
    this.isWebrtcHost = !(
      params.has("joinSharedSession") &&
      params.get("joinSharedSession") === "true"
    );

    if (!(documentName && documentPassword)) {
      documentName = this.makeid(64);
      documentPassword = this.makeid(64);
    }

    this.ydoc = new Y.Doc();
    this.shareUrl = `https://sebtota.github.io/TipTapSN/?joinSharedSession=true&documentName=${documentName}&documentPassword=${documentPassword}`;

    this.provider = new WebrtcProvider(documentName, this.ydoc, {
      password: documentPassword,
    });
  }

  getExtensions() {
    return [
      Collaboration.configure({
        document: this.ydoc,
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

  getShareUrl() {
    return this.shareUrl;
  }

  changeName(name) {
    this.user['name'] = name;
  }

  getUser() {
    return this.user
  }

  getUserName() {
    return this.user['name'];
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
  }

  /*
   * Event handles used to keep track of users in the webRTC room and to make sure all the users know who the host is
   */
  peerChangeEventHandler(data) {
    console.log("peers");
    console.log(this);
    const removed = data["removed"];
    const added = data["added"];
    // const webrtcPeers = data["webrtcPeers"];
    //const bcPeers = data['bcPeers']

    for (let i = 0; i < added.length; i++) {
      const rtcId = added[i];
      const rtcConns = this.provider["room"]["webrtcConns"];

      console.log(rtcConns.get(rtcId));

      /*
       * Client only (not host): Listen for messages to determine which user inside of the room is the host
       */
      if (this.webrtcHostId === undefined) {
        console.log("Listening for host id message");
        rtcConns.get(rtcId).peer.on("data", (message) => {
          this.webrtcHostIdMessageListener(message);
        });
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
        alert(
          "Host disconnected. Document is no longer being saved by the host."
        );
      }
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
          console.log(this);
          /*
           * WebRTC clients (non-hosts) should remember the hosts unique ID to determine when the host has left the room.
           * On each subsequent `peers` event, they should check to see if that unique ID has left. If so, the host has left the room.
           */
          this.provider.on("peers", (data) =>
            this.peerChangeEventHandler(data)
          );

          // User connected to room
          if (this.isWebrtcHost) {
            this.webrtcHostId = this.provider["room"]["peerId"]; // Set the hostId to the current users id
            resolve();
          }
          clearInterval(_interval);
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
