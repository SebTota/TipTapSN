(function(t){function e(e){for(var n,s,c=e[0],a=e[1],d=e[2],l=0,h=[];l<c.length;l++)s=c[l],Object.prototype.hasOwnProperty.call(r,s)&&r[s]&&h.push(r[s][0]),r[s]=0;for(n in a)Object.prototype.hasOwnProperty.call(a,n)&&(t[n]=a[n]);u&&u(e);while(h.length)h.shift()();return o.push.apply(o,d||[]),i()}function i(){for(var t,e=0;e<o.length;e++){for(var i=o[e],n=!0,c=1;c<i.length;c++){var a=i[c];0!==r[a]&&(n=!1)}n&&(o.splice(e--,1),t=s(s.s=i[0]))}return t}var n={},r={app:0},o=[];function s(e){if(n[e])return n[e].exports;var i=n[e]={i:e,l:!1,exports:{}};return t[e].call(i.exports,i,i.exports,s),i.l=!0,i.exports}s.m=t,s.c=n,s.d=function(t,e,i){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(s.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)s.d(i,n,function(e){return t[e]}.bind(null,n));return i},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/TipTapSN/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],a=c.push.bind(c);c.push=e,c=c.slice();for(var d=0;d<c.length;d++)e(c[d]);var u=a;o.push([0,"chunk-vendors"]),i()})({0:function(t,e,i){t.exports=i("56d7")},1249:function(t,e,i){},"4e85":function(t,e,i){"use strict";i("db28")},"56d7":function(t,e,i){"use strict";i.r(e);i("e260"),i("e6cf"),i("cca6"),i("a79d");var n=i("2b0e"),r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{attrs:{id:"app"}},[i("tiptap")],1)},o=[],s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.editor?i("div",{staticClass:"editor"},[i("menu-bar",{staticClass:"editor__header",attrs:{editor:t.editor,tiptap:t.tiptap}}),i("editor-content",{staticClass:"editor__content",attrs:{editor:t.editor}}),i("div",{staticClass:"editor__footer"},[i("div",{class:"editor__status editor__status--"+t.tiptap.isWebrtcConnected()},[!0===t.tiptap.isWebrtcConnected()?[t._v(" "+t._s(t.webrtcBridge.getConnectedUsers().length)+" user"+t._s(1===t.webrtcBridge.getConnectedUsers().length?"":"s")+" online")]:[t._v(" Offline ")]],2),i("div",{staticClass:"editor__name"},[!0===t.tiptap.isWebrtcConnected()?[i("button",{on:{click:function(e){return t.tiptap.presentSharingUrl()}}},[t._v(" Sharing Link ")]),i("button",{on:{click:function(e){return t.tiptap.changeSharingUserName()}}},[t._v(" "+t._s(t.webrtcBridge.getUserName())+" ")])]:t._e()],2)])],1):t._e()},c=[],a=i("5530"),d=(i("d3b7"),i("3ca3"),i("ddb0"),i("2b3d"),i("ac1f"),i("841c"),i("99af"),i("498a"),i("1ab4")),u=i("9980"),l=i("bf38"),h=i("4377"),p=i("5924"),f=i("1d91"),v=i("1037"),b=i("0392"),g=i("79bb"),m=i("9751"),k=i("0b6c"),w=i("82d4"),y=i("4976"),S=i("a5c6"),C=i("056c"),_=i("4674"),x=i("2718"),A=i("7eea"),B=i("c088"),T=i("dce4"),E=i("64fe"),H=i("14b4"),U=i("ed4b"),O=i("77d4"),W=i("7eb1"),j=i("2684"),R=i("e3ff"),I=i("9759"),N=i("d4ec"),P=i("bee2"),L=function(){function t(e){var i=e.title,n=e.text,r=e.placeholder,o=e.submitCallback,s=e.dismissCallback;Object(N["a"])(this,t),this.title=i,this.text=n,this.placeholder=r,this.submitCallback=o,this.dismissCallback=s}return Object(P["a"])(t,[{key:"promptString",value:function(){var t='<div class="sk-panel-row">\n      '.concat(this.text?"<p class='sk-p'>".concat(this.text,"</p>"):"",'\n      </div>\n      <div class="sk-panel-row">\n      <input id="sk-prompt-input" class="sk-input contrast" ').concat(this.placeholder?'placeholder="'.concat(this.placeholder,'"'):"","/>\n      </div>");return t}},{key:"buttonsString",value:function(){var t="\n        <div class='sk-button-group'>\n        <button id='sk-prompt-button-close' class='sn-button small'>\n          <div class='sk-label'>Close</div>\n        </button>\n        <button id='sk-prompt-button-ok' class='sn-button small neutral'>\n          <div class='sk-label'>OK</div>\n        </button>\n        </div>\n      ";return t}},{key:"templateString",value:function(){var t,e=this.title?"<div class='sk-h3 sk-panel-section-title'>".concat(this.title,"</div>"):"",i='\n        <div class="sk-modal">\n          <div class="sk-modal-background"></div>\n          <div class="sk-modal-content">\n            <div class="sn-component">\n              <div class="sk-panel" style=\'max-width: 500px;\'>\n                <div class="sk-panel-content" '.concat(t,'>\n                  <div class="sk-panel-section">\n                    ').concat(e,"\n                    ").concat(this.promptString(),"\n                    ").concat(this.buttonsString(),"\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      ");return i}},{key:"dismiss",value:function(){this.onElement.removeChild(this.element),this.dismissCallback&&this.dismissCallback()}},{key:"submit",value:function(){var t=this.element.querySelector("#sk-prompt-input").value;this.onElement.removeChild(this.element),this.submitCallback&&this.submitCallback(t)}},{key:"present",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=e.onElement;i||(i=document.body),this.onElement=i,this.element=document.createElement("div"),this.element.className="sn-component",this.element.innerHTML=this.templateString().trim(),i.appendChild(this.element),this.element.querySelector("#sk-prompt-button-close").onclick=function(){t.dismiss()},this.element.querySelector("#sk-prompt-button-ok").onclick=function(){t.submit()},this.element.querySelector("#sk-prompt-input").focus()}}]),t}(),M=i("1b9f"),q=i.n(M),K=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[t._l(t.items,(function(e,n){return["divider"===e.type?i("div",{key:n,staticClass:"divider"}):i("menu-item",t._b({key:n},"menu-item",e,!1))]}))],2)},D=[],F=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.isRendered()?n("button",{staticClass:"menu-item",class:{"is-active":t.isActive?t.isActive():null},attrs:{title:t.title},on:{click:t.action}},[n("svg",{staticClass:"remix"},[n("use",{attrs:{"xlink:href":i("29a1")+"#ri-"+t.icon}})])]):t._e()},$=[],z={props:{icon:{type:String,required:!0},title:{type:String,required:!0},action:{type:Function,required:!0},isActive:{type:Function,default:null},isRendered:{type:Function,default:function(){return!0}}}},J=z,V=(i("dfee"),i("2877")),G=Object(V["a"])(J,F,$,!1,null,"23d8d519",null),Q=G.exports,X={components:{MenuItem:Q},props:{editor:{type:Object,required:!0},tiptap:{type:Object,required:!0}},data:function(){var t=this;return{items:[{icon:"bold",title:"Bold",action:function(){return t.editor.chain().focus().toggleBold().run()},isActive:function(){return t.editor.isActive("bold")}},{icon:"italic",title:"Italic",action:function(){return t.editor.chain().focus().toggleItalic().run()},isActive:function(){return t.editor.isActive("italic")}},{icon:"strikethrough",title:"Strike",action:function(){return t.editor.chain().focus().toggleStrike().run()},isActive:function(){return t.editor.isActive("strike")}},{icon:"code-view",title:"Code",action:function(){return t.editor.chain().focus().toggleCode().run()},isActive:function(){return t.editor.isActive("code")}},{icon:"mark-pen-line",title:"Highlight",action:function(){return t.editor.chain().focus().toggleHighlight().run()},isActive:function(){return t.editor.isActive("highlight")}},{icon:"table-2",title:"Table",action:function(){return t.editor.chain().focus().insertTable({rows:3,cols:3,withHeaderRow:!0}).run()}},{type:"divider"},{icon:"h-1",title:"Heading 1",action:function(){return t.editor.chain().focus().toggleHeading({level:1}).run()},isActive:function(){return t.editor.isActive("heading",{level:1})}},{icon:"h-2",title:"Heading 2",action:function(){return t.editor.chain().focus().toggleHeading({level:2}).run()},isActive:function(){return t.editor.isActive("heading",{level:2})}},{icon:"h-3",title:"Heading 3",action:function(){return t.editor.chain().focus().toggleHeading({level:3}).run()},isActive:function(){return t.editor.isActive("heading",{level:3})}},{icon:"paragraph",title:"Paragraph",action:function(){return t.editor.chain().focus().setParagraph().run()},isActive:function(){return t.editor.isActive("paragraph")}},{icon:"list-unordered",title:"Bullet List",action:function(){return t.editor.chain().focus().toggleBulletList().run()},isActive:function(){return t.editor.isActive("bulletList")}},{icon:"list-ordered",title:"Ordered List",action:function(){return t.editor.chain().focus().toggleOrderedList().run()},isActive:function(){return t.editor.isActive("orderedList")}},{icon:"list-check-2",title:"Task List",action:function(){return t.editor.chain().focus().toggleTaskList().run()},isActive:function(){return t.editor.isActive("taskList")}},{icon:"code-box-line",title:"Code Block",action:function(){return t.editor.chain().focus().toggleCodeBlock().run()},isActive:function(){return t.editor.isActive("codeBlock")}},{type:"divider"},{icon:"double-quotes-l",title:"Blockquote",action:function(){return t.editor.chain().focus().toggleBlockquote().run()},isActive:function(){return t.editor.isActive("blockquote")}},{icon:"separator",title:"Horizontal Rule",action:function(){return t.editor.chain().focus().setHorizontalRule().run()}},{type:"divider"},{icon:"text-wrap",title:"Hard Break",action:function(){return t.editor.chain().focus().setHardBreak().run()}},{icon:"format-clear",title:"Clear Format",action:function(){return t.editor.chain().focus().clearNodes().unsetAllMarks().run()}},{type:"divider"},{icon:"arrow-go-back-line",title:"Undo",action:function(){return t.editor.chain().focus().undo().run()}},{icon:"arrow-go-forward-line",title:"Redo",action:function(){return t.editor.chain().focus().redo().run()}},{type:"divider"},{icon:"file-cloud-line",title:"Share Note",action:function(){t.tiptap.setupWebrtc()},isRendered:function(){return!t.tiptap.isWebrtcConnected()}},{icon:"file-lock-line",title:"Disconnect",action:function(){t.tiptap.disconnectWebrtc()},isRendered:function(){return t.tiptap.isWebrtcConnected()}}]}}},Y=X,Z=(i("edf0"),i("e26c"),Object(V["a"])(Y,K,D,!1,null,"df6e3058",null)),tt=Z.exports,et=(i("0d03"),i("25f0"),i("b0c0"),i("caad"),i("2532"),i("4795"),i("7428")),it=i("5ea1"),nt=i("986d"),rt=i("1bd2"),ot=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0;Object(N["a"])(this,t),this.ydoc=null,this.provider=null,this.isWebrtcHost=!1,this.webrtcHostId=n,this.shareUrl="",this.users=[],this.user={name:"User",color:"#"+Math.floor(16777215*Math.random()).toString(16)},this.document={name:e,password:i};var r=new URLSearchParams(window.location.search);this.isWebrtcHost=!(r.has("joinSharedSession")&&"true"===r.get("joinSharedSession")),this.document["name"]&&this.document["password"]||(this.document["name"]=this.makeid(64),this.document["password"]=this.makeid(64)),this.ydoc=new et["d"],this.provider=new it["a"](this.document["name"],this.ydoc,{password:this.document["password"]})}return Object(P["a"])(t,[{key:"getExtensions",value:function(){var t=this;return[nt["a"].configure({document:this.ydoc}),rt["a"].configure({provider:this.provider,user:this.user,onUpdate:function(e){t.users=e}})]}},{key:"getConnectedUsers",value:function(){return this.users}},{key:"getUser",value:function(){return this.user}},{key:"getShareUrl",value:function(){return this.shareUrl}},{key:"getUserName",value:function(){return this.user["name"]}},{key:"changeName",value:function(t){this.user["name"]=t}},{key:"isHost",value:function(){return this.isWebrtcHost}},{key:"makeid",value:function(t){for(var e="",i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",n=i.length,r=0;r<t;r++)e+=i.charAt(Math.floor(Math.random()*n));return e}},{key:"getWebrtcPeerId",value:function(){if(this.provider)return this.provider.room.peerId}},{key:"peerChangeEventHandler",value:function(t){var e=t.removed;t.added,t.webrtcPeers,t.bcPeers;!this.isWebrtcHost&&e.includes(this.webrtcHostId)&&alert("Host disconnected. Document is no longer being saved by the host.")}},{key:"waitToConnect",value:function(){var t=this;return new Promise((function(e,i){var n=setInterval((function(){!1===t.provider.connected?console.log("Waiting to connect to WebRTC room"):(console.log("Connected to WebRTC room"),t.isWebrtcHost&&(t.webrtcHostId=t.provider["room"]["peerId"]),t.shareUrl="https://sebtota.github.io/TipTapSN/?joinSharedSession=true&documentName=".concat(t.document["name"],"&documentPassword=").concat(t.document["password"],"&hostId=").concat(t.webrtcHostId),t.provider.on("peers",(function(e){return t.peerChangeEventHandler(e)})),clearInterval(n),e())}),100)}))}},{key:"isConnectedWebrtc",value:function(){return!!this.provider&&this.provider.connected}},{key:"disconnectWebrtc",value:function(){this.provider&&(this.provider.disconnect(),this.provider.destroy())}}]),t}(),st={components:{EditorContent:d["a"],MenuBar:tt},data:function(){return{tiptap:void 0,editor:null,editorKit:null,note_uuid:void 0,skipInsertRawText:!1,webrtcBridge:void 0}},mounted:function(){this.tiptap=this,this.configureEditorKit(),this.configureEditor()},beforeDestroy:function(){this.webrtcBridge&&this.webrtcBridge.provider&&this.webrtcBridge.provider.destroy(),this.editor.destroy()},methods:{configureEditorKit:function(){var t=this,e={setEditorRawText:function(e){console.log("set text"),t.skipInsertRawText?t.skipInsertRawText=!1:t.editor.commands.setContent(e)},clearUndoHistory:function(){t.configureEditor()},onNoteLockToggle:function(e){t.editor.setEditable(!e)},onNoteValueChange:function(e){void 0===t.note_uuid?t.note_uuid=e.uuid:t.note_uuid===e["uuid"]?t.skipInsertRawText=!0:(t.note_uuid=e.uuid,t.configureEditor())}};this.editorKit=new q.a(e,{mode:"html",supportsFileSafe:!1})},configureEditor:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],i=null;this.editor&&(i=this.editor.getHTML(),this.editor.off(this.onEditorUpdate),this.editor.destroy(),this.webrtcBridge&&this.webrtcBridge.disconnectWebrtc(),this.webrtcBridge=void 0);var n,r,o,s=new URLSearchParams(window.location.search);s.has("joinSharedSession")&&"true"===s.get("joinSharedSession")&&(e=!0,n=s.get("documentName"),r=s.get("documentPassword"),o=s.get("hostId"));var c=[k["a"].configure({resizable:!0}),h["a"],p["a"].extend({addAttributes:function(){var t;return{testAttr:Object(a["a"])(Object(a["a"])({},null===(t=this.parent)||void 0===t?void 0:t.call(this)),{},{default:null,keepOnSplit:!1})}}}),f["a"],C["a"],v["a"],w["a"],S["a"],y["a"],m["a"],b["a"],g["a"],_["a"],x["a"],A["a"],B["a"],T["a"],E["a"],H["a"],U["a"],O["a"],W["a"],j["a"],R["a"]];e?(this.webrtcBridge=new ot(n,r,o),this.webrtcBridge.waitToConnect().then((function(){t.webrtcBridge.isHost()&&t.presentSharingUrl()})),c=c.concat(this.webrtcBridge.getExtensions())):c.push(l["a"]),this.tiptap=this,this.editor=new u["a"]({extensions:c,autofocus:!0}),this.editor.on("update",this.onEditorUpdate),i&&this.editor.commands.setContent(i)},onEditorUpdate:function(){this.editorKit.onEditorValueChanged(this.editor.getHTML())},copyStringToClipboard:function(t){if("string"===typeof t){var e=document.createElement("textarea");e.value=t,e.style.position="absolute",e.style.left="-999px",document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e)}},presentSharingUrl:function(){console.log(this.webrtcBridge.getShareUrl()),this.copyStringToClipboard(this.webrtcBridge.getShareUrl());var t=new I["SKAlert"]({title:"Share link copied to clipboard",text:"The share link was added to your clipboard. Share it with others to allow them to edit your note.",buttons:[{text:"Close",style:"neutral",action:function(){}}],prompt:{text:"Enter your name:",placeholder:"Test User"}});t.present()},presentSharingDisconnected:function(){console.log("Disonnected from WebRTC");var t=new I["SKAlert"]({title:"Stopped sharing note.",text:"Sharing for this note is now disabled.",buttons:[{text:"Close",style:"neutral",action:function(){}}]});t.present()},presentSharingNotStarted:function(){console.log("Did not disconnect from WebRTC. WebRTC was not enabled.");var t=new I["SKAlert"]({title:"Sharing for this note was not enabled.",text:"Sharing for this note was already turned off.",buttons:[{text:"Close",style:"neutral",action:function(){}}]});t.present()},setupWebrtc:function(){this.webrtcBridge&&this.webrtcBridge.provider&&this.editor?this.presentSharingUrl():this.configureEditor(!0)},disconnectWebrtc:function(){this.webrtcBridge&&this.webrtcBridge.isConnectedWebrtc()?(this.webrtcBridge&&this.webrtcBridge.disconnectWebrtc(),this.presentSharingDisconnected(),this.configureEditor()):this.presentSharingNotStarted()},isWebrtcConnected:function(){return this.webrtcBridge&&this.webrtcBridge.isConnectedWebrtc()},changeSharingUserName:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:void 0,i=new L({title:"Set Share Name",text:"Enter the name you would like others to see your edits as.",placeholder:"User",submitCallback:function(i){""===i.trim()&&(i="User"),t.webrtcBridge&&t.webrtcBridge.changeName(i),t.editor.chain().focus().user(t.webrtcBridge.getUser()).run(),e&&e()},dismissCallback:function(){}});i.present()}}},ct=st,at=(i("8b18"),i("4e85"),Object(V["a"])(ct,s,c,!1,null,"71d9f2a8",null)),dt=at.exports,ut={name:"App",components:{Tiptap:dt}},lt=ut,ht=(i("7ca5"),Object(V["a"])(lt,r,o,!1,null,null,null)),pt=ht.exports;n["a"].config.productionTip=!1,new n["a"]({render:function(t){return t(pt)}}).$mount("#app")},"8b18":function(t,e,i){"use strict";i("bd20")},b328:function(t,e,i){},bd20:function(t,e,i){},db28:function(t,e,i){},dee8:function(t,e,i){},dfee:function(t,e,i){"use strict";i("b328")},e26c:function(t,e,i){"use strict";i("dee8")},edf0:function(t,e,i){"use strict";i("1249")}});
//# sourceMappingURL=app.2e5664fc.js.map