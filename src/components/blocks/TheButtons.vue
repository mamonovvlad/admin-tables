<script setup>
import TheButton from "@/components/elements/TheButton.vue";
import {useCurrenciesStore} from "@/stores/CurrenciesStore";
import {useDefaultStore} from "@/stores/DefaultStore";
import {useCashStore} from "@/stores/CashStore";
import {useUpdateTable} from "@/stores/UpdateTable";
import {onMounted, ref} from "vue";

const currenciesStore = useCurrenciesStore();
const defaultStore = useDefaultStore();
const cashStore = useCashStore();
const updateTable = useUpdateTable();

const edit = (e) => {
  e.target.setAttribute("href", `/course-template/update?id=${currenciesStore.templateId}`);
}
//
const copy = (e) => {
  e.target.setAttribute("href", `/course-template/copy?id=${currenciesStore.templateId}`);
}
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

const enableAll =()=>{
  let data;
  cashStore.rowData.value.forEach(item => {
    item.active = 1;
    data = JSON.stringify({
      id: item.id,
      field: 'active',
      value: item.active
    })
    updateTable.changeCourseCity(data)
    console.log(data)
  })
  cashStore.gridApi.api.setRowData(cashStore.rowData)
}
const turnOff =()=>{
  let data;
  cashStore.rowData.value.forEach(item => {
    if (item.city.code === 'KIEV') {
      item.active = 1;
      data = JSON.stringify({
        id: item.id,
        field: 'active',
        value: item.active
      })
    } else {
      item.active = 0;
      data = JSON.stringify({
        id: item.id,
        field: 'active',
        value: item.active
      })
    }
    console.log(data)
    updateTable.changeCourseCity(data)
  })
  cashStore.gridApi.api.setRowData(cashStore.rowData)
}

onMounted(() => {
  mergeCash();
  mergePercentageExchange();
})
</script>

<template>
  <div class="buttons">
    <template v-if="defaultStore.isShowInformation ==='0'">
      <the-button>Добавить</the-button>
      <the-button>Все Шаблоны</the-button>
      <the-button tag="a" @click="edit">Изменить</the-button>
      <the-button tag="a" @click="copy">Копировать</the-button>
    </template>
    <template v-else-if="defaultStore.isShowInformation ==='1'">
      <the-button>Добавить связь</the-button>
      <the-button @click="turnOff">Выключить все кроме Киева</the-button>
      <the-button @click="enableAll">Включить все</the-button>
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