<script setup>
import {defineProps, defineEmits} from "vue";

const emit = defineEmits(['mousedown', 'mouseup','changeInput'])
const props = defineProps({
  namePlaceholder: {
    type: String,
    default: ''
  },
  nameClass: {
    type: String,
    default: ''
  },
  dataInput: {
    type: String,
    default: ''
  },
  dataPrimaryCurrencyId: {
    type: String,
    default: ''
  }
})

</script>

<template>
  <label class="label">
    <slot></slot>
    <span class="input">
      <input step="0.1" :placeholder="props.namePlaceholder"  :data-primary_currency_ids="props.dataPrimaryCurrencyId" :class="props.nameClass" @change="emit('changeInput',$event)">
      <button class="button--small" type="button" data-sign="-" :data-input="props.dataInput"
              @mouseup="emit('mouseup',$event)" @mousedown="emit('mousedown',$event)">-</button>
      <button class="button--small" type="button" data-sign="+" :data-input="props.dataInput"
              @mouseup="emit('mouseup',$event)" @mousedown="emit('mousedown',$event)">+</button>
    </span>
  </label>
</template>


<style lang="scss">
.input {
  display: flex;
  max-width: 240px;
  min-width: 180px;
  width: 100%;
  box-shadow: 0 5px 10px var(--light-gray);
  border: 1px solid var(--light-gray);

  & input {
    width: 100%;
    padding-left: 10px;
    padding-right: 10px;
    border: none;
    outline: none;
  }

  & button {
    margin: 4px;
  }

}
</style>