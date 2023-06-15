<script setup>
import {useDefaultStore} from "@/stores/DefaultStore";
import {onMounted, ref} from "vue";

const defaultStore = useDefaultStore();


let inputMergeCash = ref('0');
let inputMergePercentageExchange = ref('0');
let inputMergeBtcEth = ref('0');

const inputMerge = (name, variable) => {
  if (localStorage.getItem(`${name}`) !== null) {
    if (localStorage.getItem(`${name}`) === '1') {
      variable.value = localStorage.getItem(`${name}`)
    } else {
      variable.value = localStorage.getItem(`${name}`)
    }
  }
}

function mergeFields(variable, name) {
  if (variable === '0') {
    localStorage.setItem(name, '1');
  } else {
    localStorage.setItem(name, '0');
  }
}

onMounted(() => {

  inputMerge('merge-cash', inputMergeCash);
  inputMerge('merge-percentage-exchange', inputMergePercentageExchange);
  inputMerge('merge-btc-eth', inputMergeBtcEth);
})
</script>

<template>
  <div class="buttons">
    <template v-if="defaultStore.isShowInformation ==='1'">
      <label class="wrapper-label">
        <input class="default-checkbox"
               type="checkbox"
               :checked="inputMergeCash==='1'"
               :value="inputMergeCash"
               @change="mergeFields(inputMergeCash,'merge-cash')">
        {{ inputMergeCash.value }}
        Объединить USD и EUR
      </label>
      <label class="wrapper-label">
        <input class="default-checkbox"
               type="checkbox"
               :checked="inputMergePercentageExchange==='1'"
               :value="inputMergePercentageExchange"
               @change="mergeFields(inputMergePercentageExchange,'merge-percentage-exchange')">
        Объединить процент биржи (USD и EUR)
      </label>
      <label class="wrapper-label">
        <input class="default-checkbox"
               type="checkbox"
               :checked="inputMergeBtcEth==='1'"
               :value="inputMergeBtcEth"
               @change="mergeFields(inputMergeBtcEth,'merge-btc-eth')">
        Объединить Bitcoin и Ethereum
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