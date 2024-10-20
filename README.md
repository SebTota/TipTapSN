# TipTapSN
## DEPRECATION NOTICE
This Standard Notes editor is no longer maintained and has been deprecated due to changes in Standard Notes. This editor may no longer function in the latest version of Standard Notes, but the notes are transferable to any HTML based editor in Standard Notes.

While a new version of this editor is in the works, the current version should no longer be used.

### Description

TipTapSN is a collaborative note editor built for [Standard Notes](https://standardnotes.com) using the [TipTap](https://www.tiptap.dev) WYSIWYG editor. The key benefit of TipTapSN is the collaborative feature which allows you to work on a note with multiple users.

Watch this [video](https://drive.google.com/file/d/1zgZXtHYWN3DweDkmvSAioeLVHQhykvHY/view?usp=sharing) for an example. 

## Sharing

### Note Editing
* Users can see everyone elses cursor, including what they currently have selected
* Each users history is their own
    * Undo/Redo buttons only undo/redo your own work, not the work of others
* Users are notified when the host leaves

### Possible Downsides
* Because you can only edit your own note history, you can not backtrack an edit made by another user.
    * This is partially mitigated by Standard Notes History feature, but this only takes snapshots at certain intervals. Please be aware of this and only share your notes with individuals you trust.
* WebRTC has been shown to have the ability to [leak your IP address](https://ieeexplore.ieee.org/document/8167801) even if you are using a VPN. You can check if your browser and/or VPN leaks your IP address online. 

### Benefits
* Once the connection between the users has been established, all your communication is P2P and never travels through any servers.
* No data communication servers means that you don't have to worry about server outages or servers being outright shut down.
* WebRTC is supported by most modern desktop and mobile browsers

## How to install the editor in Standard Notes

* Open the Standard Notes application and click the 'Extensions` button.
* Click `Import Extension`
* Paste this URL into the text box
```
https://sebtota.github.io/TipTapSN/ext.json
```
* Click Enter

## Development

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
