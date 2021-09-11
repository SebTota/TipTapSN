<template>
  <div id="filesafe-modal" class="modal" ref="filesafeModal">
    <div class="modal-content">
      <div class="modal-header">
        <span class="filesafe-modal-close" ref="filesafeModalCloseButton"
          >&times;</span
        >
        <h2 class="modal-header-text">FileSafe</h2>
      </div>
      <div id="filesafe-react-client" ref="filesafeMountPoint"></div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.addFilesafeEventListeners();
  },
  methods: {
    /*
     * Render Filesafe Modal and mount it in the document
     */
    showModal() {
      this.filesafe = window.filesafe_params;
      this.filesafe.embed.FilesafeEmbed.renderInElement(
        this.$refs.filesafeMountPoint,
        this.filesafe.client
      );
      this.$refs.filesafeModal.style.display = "block";
    },

    /*
     * Close the Filesafe Modal
     */
    closeFilesafeModal() {
      this.$refs.filesafeModal.style.display = "none";
    },

    /*
     * Add all associated event listeners that deal with the Filesafe modals interactions
     */
    addFilesafeEventListeners() {
      this.closeFilesafeModalOnCloseButtonClickEventListener();
      this.closeFilesafeModalOnOutsideModalClickEventListener();
    },

    /*
     * Event Listener - Close the Filesafe modal when a user clicks the 'X' button
     */
    closeFilesafeModalOnCloseButtonClickEventListener() {
      document;
      this.$refs.filesafeModalCloseButton.addEventListener(
        "click",
        this.closeFilesafeModal
      );
    },

    /*
     * Event Listener - Close the Filesafe modal when a user clicks outside of the modal
     */
    closeFilesafeModalOnOutsideModalClickEventListener() {
      window.onclick = (event) => {
        if (event.target == this.$refs.filesafeModal) {
          this.closeFilesafeModal();
        }
      };
    },
  },
};
</script>

<style lang="scss">
/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: var(--sn-stylekit-background-color);
  margin: auto;
  border: 1px solid #888;
  width: 80%;
}

.modal-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.modal-header-text {
  font-size: 18px;
  padding: 20px;
  color: var(--sn-stylekit-editor-foreground-color) !important;
  font-weight: 700;
  margin: 0;
}

/* Modal Close Button */
.filesafe-modal-close {
  color: var(--sn-stylekit-foreground-color);
  float: right;
  font-weight: bold;
  font-size: 18px;
  padding: 20px;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>
