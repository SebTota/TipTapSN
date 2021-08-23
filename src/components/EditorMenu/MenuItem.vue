<template>
  <button v-if="isRendered()"
    class="menu-item"
    :class="{ 'is-active': isActive ? isActive(): null }"
    @click="buttonClick"
    :title="title"
    ref="menuItemButton"
  >
    <svg class="remix">
      <use :xlink:href="require('remixicon/fonts/remixicon.symbol.svg') + `#ri-${icon}`" />
    </svg>

    <template v-if="dropdownOptions">
      <div class="dropdown-content" ref="dropdown">
        <template  v-for="(dropdownItem, dropdownIndex) in dropdownOptions">
          <DropdownOptionItem :key="dropdownIndex" v-bind="dropdownItem"/>
        </template>
      </div>
    </template>
    
  </button>
</template>

<script>
import DropdownOptionItem from './DropdownOptionItem.vue'

export default {
  components: {
    DropdownOptionItem
  },

  mounted() {
    if (this.$refs.dropdown) {
      this.addDropdownCloseListener();
    }
  },

  props: {
    icon: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    action: {
      type: Function,
      required: true,
    },

    isActive: {
      type: Function,
      default: null,
    },

    isRendered: {
      type: Function,
      default: () => {return true}
    },

    dropdownOptions: {
      type: Array,
      required: false
    },
  },

  methods: {
    /*
    * Determine if you should show dropdown and/or perform action on button click
    */
    buttonClick() {
      if (this.$refs.dropdown) {
        this.toggleDropdown();
      } 
      this.$props.action();
    },

    /*
    * Toggle between showing and hiding the dropdown
    */
    toggleDropdown() {
      this.$refs.dropdown.classList.toggle('dropdown-content-show');
    },

    /*
    * Close the dropdwon if a user clicks outside of the dropdown
    */
    addDropdownCloseListener() {
      window.onclick = (event) => {
        if (!this.$refs.menuItemButton.contains(event.target)) {
          this.$refs.dropdown.classList.remove('dropdown-content-show');
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-item {
  width: 1.75rem;
  height: 1.75rem;
  border: none;
  background-color: transparent;
  border-radius: 0.4rem;
  padding: 0.25rem;
  margin-right: 0.25rem;

  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  &.is-active,
  &:hover {
    color: #FFF;
    background-color: #0D0D0D;
  }
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  overflow: auto;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content-show {display: block;}
</style>