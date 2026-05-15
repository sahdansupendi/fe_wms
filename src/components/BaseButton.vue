<script setup>

import { computed } from "vue";

const props = defineProps({

  /*
  ========================================
  IDENTIFIER
  ========================================
  */

  id: {
    type: String,
    default: ""
  },

  name: {
    type: String,
    default: ""
  },

  /*
  ========================================
  CONTENT
  ========================================
  */

  label: {
    type: String,
    default: "Button"
  },

  /*
  ========================================
  BUTTON TYPE
  ========================================
  */

  type: {
    type: String,
    default: "button"
  },

  /*
  ========================================
  VARIANT SYSTEM
  ========================================
  */

  variant: {
    type: String,
    default: "primary"
  },

  /*
  ========================================
  SIZE SYSTEM
  ========================================
  */

  size: {
    type: String,
    default: "md"
  },

  /*
  ========================================
  LAYOUT SYSTEM
  ========================================
  */

  full: {
    type: Boolean,
    default: false
  },

  width: {
    type: String,
    default: ""
  },

  height: {
    type: String,
    default: ""
  },

  /*
  ========================================
  STATE
  ========================================
  */

  disabled: {
    type: Boolean,
    default: false
  },

  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  "click"
]);

/*
========================================
SIZE SYSTEM
========================================
*/

const sizeClass = computed(() => {

  switch (props.size) {

    case "sm":
      return "btn-sm";

    case "lg":
      return "btn-lg";

    default:
      return "btn-md";
  }
});

/*
========================================
VARIANT SYSTEM
========================================
*/

const variantClass = computed(() => {

  switch (props.variant) {

    case "success":
      return "btn-success";

    case "danger":
      return "btn-danger";

    case "secondary":
      return "btn-secondary";

    case "outline":
      return "btn-outline";

    default:
      return "btn-primary";
  }
});

/*
========================================
DYNAMIC STYLE
========================================
*/

const buttonStyle = computed(() => {

  return {

    width: props.full
        ? "100%"
        : props.width,

    height: props.height
  };
});

</script>

<template>

  <button

      :id="id"

      :name="name"

      :type="type"

      :disabled="disabled || loading"

      :style="buttonStyle"

      :class="[
            'base-button',

            sizeClass,

            variantClass,

            full
                ? 'btn-full'
                : ''
        ]"

      @click="emit('click')"
  >

    <!--
    ========================================
    LOADING SPINNER
    ========================================
    -->

    <span
        v-if="loading"
        class="spinner"
    ></span>

    <!--
    ========================================
    SLOT SUPPORT
    ========================================
    -->

    <slot>

      {{ loading
        ? "Loading..."
        : label }}

    </slot>

  </button>

</template>

<style scoped>

/*
========================================
BASE BUTTON
========================================
*/

.base-button {

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  border: none;

  border-radius: 12px;

  cursor: pointer;

  font-weight: 300;

  transition:
      all 0.2s ease;

  font-family:
      Arial,
      sans-serif;
}

/*
========================================
HOVER
========================================
*/

.base-button:hover {

  transform:
      translateY(-1px);

  opacity: 0.95;
}

/*
========================================
DISABLED
========================================
*/

.base-button:disabled {

  opacity: 0.7;

  cursor: not-allowed;

  transform: none;
}

/*
========================================
SIZE SYSTEM
========================================
*/

.btn-sm {

  height: 38px;

  padding: 0 14px;

  font-size: 13px;
}

.btn-md {

  height: 46px;

  padding: 0 18px;

  font-size: 14px;
}

.btn-lg {

  height: 56px;

  padding: 0 24px;

  font-size: 16px;
}

/*
========================================
FULL WIDTH
========================================
*/

.btn-full {
  width: 100%;
}

/*
========================================
VARIANT SYSTEM
========================================
*/

.btn-primary {

  background:
      linear-gradient(
          135deg,
          #2563eb,
          #7c3aed
      );

  color: white;
}

.btn-secondary {

  background:
      #60a5fa;

  color: white;
}

.btn-success {

  background:
      #22c55e;

  color: white;
}

.btn-danger {

  background:
      #ef4444;

  color: white;
}

.btn-outline {

  background:
      transparent;

  border:
      1px solid #d1d5db;

  color:
      #374151;
}

/*
========================================
SHADOW
========================================
*/

.btn-primary,
.btn-secondary,
.btn-success,
.btn-danger {

  box-shadow:
      0 4px 20px rgba(0,0,0,0.15);
}

/*
========================================
LOADING SPINNER
========================================
*/

.spinner {

  width: 16px;
  height: 16px;

  border:
      2px solid white;

  border-top:
      2px solid transparent;

  border-radius: 50%;

  animation:
      spin 0.7s linear infinite;
}

@keyframes spin {

  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

</style>