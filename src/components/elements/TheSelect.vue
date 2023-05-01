<template>
  <label class="label">
     <slot name="label"></slot>
    <select class="select">
      <slot name="options"></slot>
    </select>
  </label>
</template>

<script setup>

</script>

<style lang="scss">
.label {
  display: flex;
  flex-direction: column;
  font-size: 16px;
  row-gap: 6px;
  font-weight: 600;

  & .select{
    border: 1px solid #e1e5ee;
    box-shadow: 0 5px 10px #e1e5ee;
    max-width: 240px;
    min-width: 180px;
    width: 100%;
    padding: 7px 10px;
    outline: none;
  }
}
</style>