<script setup>
import {useDefaultStore} from "@/stores/DefaultStore";
import {onMounted, ref} from "vue";
const defaultStore = useDefaultStore();


const inputMergeCash = ref('0');
const inputMergePercentageExchange = ref('0');

const mergeCash = () => {
  if (localStorage.getItem('merge-cash') !== null) {
    if (localStorage.getItem('merge-cash') === '1') {
      inputMergeCash.value = localStorage.getItem('merge-cash')
    } else {
      inputMergeCash.value = localStorage.getItem('merge-cash')
    }
  }

}
const mergePercentageExchange = () => {
  if (localStorage.getItem('merge-percentage-exchange') !== null) {
    if (localStorage.getItem('merge-percentage-exchange') === '1') {
      inputMergePercentageExchange.value = localStorage.getItem('merge-percentage-exchange')
    } else {
      inputMergePercentageExchange.value = localStorage.getItem('merge-percentage-exchange')
    }
  }
}
const mergeFields = (field, name) => {
  if (field === 'cash') {
    if (inputMergeCash.value === '0') {
      localStorage.setItem(name, '1');
      inputMergeCash.value = '1'
    } else {
      inputMergeCash.value = '0'
      localStorage.setItem(name, '0');
    }
  } else if (field === 'percentage-exchange') {
    if (inputMergePercentageExchange.value === '0') {
      localStorage.setItem(name, '1');
      inputMergePercentageExchange.value = '1'
    } else {
      inputMergePercentageExchange.value = '0'
      localStorage.setItem(name, '0');
    }
  }
}

onMounted(() => {
  mergeCash();
  mergePercentageExchange();
})
</script>

<template>
  <div class="buttons">
    <template v-if="defaultStore.isShowInformation ==='1'">
      <label class="wrapper-label">
        <input class="default-checkbox" type="checkbox" :checked="inputMergeCash==='1'" :value="inputMergeCash"
               @change="mergeFields('cash','merge-cash')">
        Объединить Tether
      </label>
      <label class="wrapper-label">
        <input class="default-checkbox" type="checkbox" :checked="inputMergePercentageExchange==='1'"
               :value="inputMergePercentageExchange"
               @change="mergeFields('percentage-exchange','merge-percentage-exchange')">
        Объединить процент биржи
      </label>
    </template>
  </div>
</template>

<style lang="scss">
.buttons {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.wrapper-label {
  display: flex;
  align-items: center;
  column-gap: 4px;
}

</style>