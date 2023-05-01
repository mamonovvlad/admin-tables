<script setup>
import { defineProps } from "vue";

const props = defineProps({
  tag: {
    type: String,
    default: 'button'
  },
})

</script>

<template>
  <component :is="props.tag" class="button">
    <slot></slot>
  </component>
</template>


<style lang="scss">
.button,
.button-small {
  border-radius: var(--radius);
  border: none;
  background: var(--blue);
  color: var(--white);
  cursor: pointer;
  box-sizing: border-box;
}

.button {
  padding: 8px 10px;

  &-small {
    padding: 4px 6px;
  }
}
</style>