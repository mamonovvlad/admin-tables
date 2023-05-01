<script setup>
import TheButtons from "@/components/blocks/TheButtons.vue";
import TheInputs from "@/components/blocks/TheInputs.vue";
import {useDefaultStore} from "@/stores/DefaultStore";

const defaultStore = useDefaultStore();

</script>

<template>
  <div class="tools">
    <the-buttons></the-buttons>
    <the-inputs v-if="defaultStore.isShowInformation === '0'"></the-inputs>
  </div>
</template>


<style lang="scss">
.tools {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 20px;
  flex-wrap: wrap;
  gap: 20px;
}


</style>