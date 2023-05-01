<script setup>
import {reactive, onMounted, ref} from "vue";
import {useDefaultStore} from "@/stores/DefaultStore";
import {useCurrenciesStore} from "@/stores/CurrenciesStore";
import {useCashStore} from "@/stores/CashStore";
import TheSelect from "@/components/elements/TheSelect.vue";
import TheButton from "@/components/elements/TheButton.vue";
const defaultStore = useDefaultStore();
const currenciesStore = useCurrenciesStore();
const cashStore = useCashStore();
const listsTable = reactive([
  {
    id: '0',
    name: 'Валюты'
  },
  {
    id: '1',
    name: 'Наличка'
  }
])
const listsTheme = reactive([
  {
    id: '0',
    name: 'Светлая',
    value: 'ag-theme-balham'
  },
  {
    id: '1',
    name: 'Тёмная',
    value: 'ag-theme-balham-dark'
  },

])
let zoom = Number(localStorage.getItem('zoom'));
let isOpen = ref(false);
let arrInputs = [];
//methods
const zoomIn = () => {
  zoom = (Number(zoom) + 0.1).toFixed(1);
  localStorage.setItem('zoom', zoom);
  defaultStore.zoomTable = zoom;
}
const zoomOut = () => {
  zoom = (zoom - 0.1).toFixed(1);
  localStorage.setItem('zoom', zoom);
  defaultStore.zoomTable = zoom;
}
const zoomReset = () => {
  zoom = '1'
  localStorage.setItem('zoom', zoom);
  defaultStore.zoomTable = zoom;
}
const tableZoomDefinitions = () => {
  if (zoom === null || zoom === 0) {
    zoom = 1;
  }
  if (localStorage.getItem("zoom")) {
    defaultStore.zoomTable = localStorage.getItem("zoom");
  }
}

const openListItems = () => {
  isOpen.value = !isOpen.value;
}
const removeColumn = (e) => {
  if (e.target.checked === true) {
    arrInputs.push(e.target.getAttribute('data-idx'));
    localStorage.setItem('column-numbers', String(arrInputs));
  } else {
    arrInputs.splice(e.target.getAttribute('data-idx'), 1);
    localStorage.setItem('column-numbers', String(arrInputs));
  }
}

const resetColumns = () => {
  if (localStorage.getItem('column-numbers')) {
    localStorage.removeItem('column-numbers')
  }
}
document.addEventListener("click", (e) => {
  if (!e.target.closest('.remove-column') || null) {
    isOpen.value = false;

  }
})
//hooks
onMounted(() => {
  defaultStore.tableDefinitions();
  defaultStore.themeDefinitions();
  tableZoomDefinitions();
})


</script>

<template>
  <header id="header" class="header">
    <div class="wrapper">
      <div class="items">
        <div class="item">
          Выберите таблицу:
          <the-select @change="defaultStore.getIdSelect">
            <template #options>
              <option v-for="list in listsTable" :key="list.id" :value="list.id"
                      :selected="defaultStore.isShowInformation === list.id">
                {{ list.name }}
              </option>
            </template>
          </the-select>
        </div>
        <div class="item">
          Выберите тему:
          <the-select @change="defaultStore.getThemeSelect">
            <template #label></template>
            <template #options>
              <option v-for="theme in listsTheme" :key="theme.id" :value="theme.value"
                      :selected="defaultStore.themeTable === theme.value">{{ theme.name }}
              </option>
            </template>
          </the-select>
        </div>
      </div>
      <div class="items">
        <the-button
                @click="defaultStore.isShowInformation === '0' ? defaultStore.autoSize(false,currenciesStore.gridApi): defaultStore.autoSize(false,cashStore.gridApi)">
          Авто размер
        </the-button>
        <the-button
                @click="defaultStore.isShowInformation === '0' ? defaultStore.maxSize(currenciesStore.gridApi): defaultStore.maxSize(cashStore.gridApi)">
          Макс размер
        </the-button>
        <the-button @click="zoomIn">Увеличить масштаб</the-button>
        <the-button @click="zoomOut">Уменьшить масштаб</the-button>
        <the-button @click="zoomReset">Сброс масштаба</the-button>
        <div class="remove-column">
          <the-button @click="openListItems">Удалить колонку</the-button>
          <ul class="list-items" id="filter-col" v-if="isOpen">
            <li v-for="column in defaultStore.listColumns" :key="column.id">
              <label>
                <input @change="removeColumn" type="checkbox" :checked="column.checked" class="default-checkbox hide"
                       :data-idx="column.id">
                <span>{{ column.name }}</span>
              </label>
            </li>
          </ul>
        </div>
        <the-button @click="resetColumns">Сбросить колонки</the-button>
      </div>
    </div>
  </header>
</template>


<style lang="scss">
.header {
  background: var(--light);
  border-bottom: 1px solid var(--light-gray);
  padding: 10px;

  & .wrapper {
    display: flex;
    justify-content: space-evenly;
    gap: 10px;
    flex-wrap: wrap;
  }

  & .items {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  & .item {
    display: flex;
    align-items: center;
    column-gap: 6px;
  }
}

.remove-column {
  position: relative;
  display: flex;

  & .list-items {
    position: absolute;
    list-style-type: none;
    background: var(--light);
    top: 34px;
    left: 5px;
    padding: 6px 10px;
    margin: 0;
    min-width: max-content;
    border: 1px solid var(--light-gray);
    max-height: 200px;
    overflow: auto;
    z-index: 1;
  }
}

</style>