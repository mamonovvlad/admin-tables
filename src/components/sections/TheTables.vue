<script setup>
import CurrenciesTable from "@/views/CurrenciesTable.vue";
import CashTable from "@/views/CashTable.vue";
import TheTools from "@/components/sections/TheTools.vue";
import {useDefaultStore} from "@/stores/DefaultStore";

const defaultStore = useDefaultStore();


</script>

<template>

<the-tools></the-tools>
  <section class="tables" :style="{zoom:defaultStore.zoomTable}">
    <currencies-table :class="defaultStore.themeTable" v-if="defaultStore.isShowInformation === '0'"></currencies-table>
    <cash-table :class="defaultStore.themeTable" v-else-if="defaultStore.isShowInformation === '1'"></cash-table>
    <p v-else>Таблица не погрузилась</p>
  </section>
</template>

<style scoped>

</style>