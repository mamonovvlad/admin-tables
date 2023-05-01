<script setup>
import {useCurrenciesStore} from "@/stores/CurrenciesStore";
import {useDefaultStore} from "@/stores/DefaultStore";
import {useUpdateTable} from "@/stores/UpdateTable";
import TheInput from "@/components/elements/TheInput.vue";
import TheSelect from "@/components/elements/TheSelect.vue";
import {computed} from "vue";

const currenciesStore = useCurrenciesStore();
const defaultStore = useDefaultStore();
const updateTable = useUpdateTable();

let timer;
let startTimer;
const getIdSelectUser = (e) => {
  clearInput();
  localStorage.setItem('user-id', e.target.value)
  currenciesStore.userId = e.target.value
  currenciesStore.receivingTemplate(true);
  currenciesStore.resetTimeout();
  currenciesStore.startTimeout();
}
const getIdSelectTemplate = (e) => {
  clearInput();
  localStorage.setItem('template-id', e.target.value)
  currenciesStore.templateId = e.target.value
  currenciesStore.receivingTemplate();
  currenciesStore.resetTimeout();
  currenciesStore.startTimeout();
}
const clearInput = () => {
  document.querySelectorAll('.clear-input').forEach(inp => {
    inp.value = '';
  })
}
const definitionPlaceholder = computed(() => {
  let primaryCurrencySell = '';
  let primaryCurrencyBuy = '';
  let placeholderSell = 'Валюта не назначена';
  let placeholderBuy = 'Валюта не назначена';
  if (currenciesStore.rowData.value) {
    for (let value of currenciesStore.rowData.value) {
      if (value.template) {
        let originalIds = value.template.primary_currency_ids;
        if (originalIds !== null && originalIds !== "" && typeof originalIds === 'string') {
          originalIds.split(',').map(function (item) {
            if (value.sellCurrency.id === item) {
              placeholderSell = `${value.sellCurrency.name_ru} на что-то`;
              primaryCurrencySell = value.template.primary_currency_ids;
            } else if (value.buyCurrency.id === item) {
              placeholderBuy = `Что-то на  ${value.buyCurrency.name_ru}`;
              primaryCurrencyBuy = value.template.primary_currency_ids;
            }
          });
        }
      }
    }
  }
  return {placeholderSell, placeholderBuy, primaryCurrencySell, primaryCurrencyBuy};
})
const startCalculator = (e) => {
  clearInterval(timer)
  clearTimeout(startTimer)
  calculator(e)
  startTimer = setTimeout(() => {
    timer = setInterval(() => {
      calculator(e)
    }, 60)
  }, 1000)
}
const endCalculator = (e) => {
  let dataInput = e.target.getAttribute('data-input');
  let input = e.target.parentElement.querySelector(`.${dataInput}`)
  clearInterval(timer);
  clearTimeout(startTimer)

  if (input.classList.contains('limiter')) {
    input.dispatchEvent(new Event("change"));
  } else if (input.classList.contains('sell-currency')) {
    input.dispatchEvent(new Event("change"));
  } else if (input.classList.contains('buy-currency')) {
    input.dispatchEvent(new Event("change"));
  }
}
const calculator = (e) => {
  let dataSign = e.target.getAttribute('data-sign');
  let number = Number(e.target.parentElement.querySelector('input').value);
  number = eval(`number
  ${dataSign}
  0.1`).toFixed(1);
  e.target.parentElement.querySelector('input').value = number;
}

const limiter = defaultStore.debounce(function (e) {
  let count = currenciesStore.gridApi.api.getDisplayedRowCount();
  let value = e.target.value;
  let courses = [];
  for (let i = 0; i < count; i++) {
    let rowNode = currenciesStore.gridApi.api.getDisplayedRowAtIndex(i);
    if (rowNode.data.course.is_active_limiter === '1') {
      rowNode.data.course.limiter = value
      rowNode.setDataValue([`course.limiter`], value)
      courses.push({
        course_id: rowNode.data.course.id,
        field: `limiter`,
        value: value,
      });
      currenciesStore.gridApi.api.flashCells({rowNodes: [rowNode], columns: [`course.limiter`]});
    }
  }
  updateTable.changeMultiple(courses)
}, 1500);

const updateCurrency = defaultStore.debounce(function (e, name) {
  let value = e.target.value;
  let originalIds = e.target.getAttribute('data-primary_currency_ids');
  let currency = document.querySelectorAll('.my-value');
  let courses = [];
  if (typeof originalIds === 'string') {
    originalIds.split(',').map(function (item) {
      currency.forEach(input => {
        let currencyIndex = input.getAttribute('data-index');
        let rowNode = currenciesStore.gridApi.api.getDisplayedRowAtIndex(+currencyIndex);

        if (input.getAttribute(`data-${name}-currency`) === item) {
          input.value = value;
          rowNode.setDataValue(['course.min_max_percent'], value)
          courses.push({
            course_id: rowNode.data.course.id,
            field: 'min_max_percent',
            value: value
          });
          currenciesStore.gridApi.api.flashCells({rowNodes: [rowNode], columns: [`course.min_max_percent`]});
        }
      })
    });
  }
  updateTable.changeMultiple(courses)
}, 1500);

</script>

<template>
  <div class="inputs">
    <div class="block">
      <the-input @change-input="limiter" name-placeholder="Ограничитель"
                 data-input="limiter" nameClass="limiter clear-input"
                 @mouseup="endCalculator"
                 @mousedown="startCalculator">
        Ограничитель
      </the-input>
    </div>
    <div class="block">
      <the-input :name-placeholder="definitionPlaceholder.placeholderSell"
                 :data-primary-currency-id="definitionPlaceholder.primaryCurrencySell"
                 data-input="sell-currency"
                 nameClass="sell-currency clear-input"
                 @mouseup="endCalculator"
                 @mousedown="startCalculator"
                 @change-input="updateCurrency($event,'sell')">
        Процент биржи
      </the-input>
      <the-input :name-placeholder="definitionPlaceholder.placeholderBuy"
                 :data-primary-currency-id="definitionPlaceholder.primaryCurrencyBuy"
                 data-input="buy-currency"
                 nameClass="buy-currency clear-input"
                 @mouseup="endCalculator"
                 @mousedown="startCalculator"
                 @change-input="updateCurrency($event,'buy')">
      </the-input>
    </div>
    <div class="block">
      <the-select @change="getIdSelectUser">
        <template #label>До обновление: {{ currenciesStore.seconds }}</template>
        <template #options>
          <option v-for="user in currenciesStore.users" :key="user.id" :value="user.id"
                  :selected="+currenciesStore.userId === +user.id">
            {{ user.fullname }}
          </option>
        </template>
      </the-select>
      <the-select class="select-template" @change="getIdSelectTemplate">
        <template #options>
          <template v-if="currenciesStore.templates.length !== 0">
            <option v-for="template in  currenciesStore.templates" :value="template.id" :key="template.id"
                    :selected="+currenciesStore.templateId === +template.id">
              {{ template.name }}
            </option>
          </template>
          <option v-else>Нет подходящих темплейтов</option>
        </template>
      </the-select>
    </div>
  </div>
</template>


<style lang="scss">
.inputs {
  display: flex;
  gap: 10px;

  & .block {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
  }
}
</style>