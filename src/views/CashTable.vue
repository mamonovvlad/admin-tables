<script setup>
import {reactive, onMounted} from "vue";
import {AgGridVue} from "ag-grid-vue3";
import {useDefaultStore} from "@/stores/DefaultStore";
import {useCashStore} from "@/stores/CashStore";
import {useCoursesStore} from "@/stores/CoursesStore";
import {useUpdateTable} from "@/stores/UpdateTable";

const defaultStore = useDefaultStore();
const coursesStore = useCoursesStore();
const cashStore = useCashStore();
const updateTable = useUpdateTable();
let clearArr;


const onModelUpdated = (params) => {
  if (localStorage.getItem('size') === '1') {
    defaultStore.maxSize(params);
  } else {
    defaultStore.autoSize(false, params);
  }
}
const onGridReady = (params) => {
  cashStore.gridApi = params;
  defaultStore.deleteColumn(params.columnApi.columnModel.columnDefs)
};

const onRowDragMove = (params) => {
  let movingNode = params.node;
  let overNode = params.overNode;
  let rowNeedsToMove = movingNode !== overNode;
  if (rowNeedsToMove) {
    let movingData = movingNode.data;
    let overData = overNode.data;
    let fromIndex = clearArr.indexOf(movingData);
    let toIndex = clearArr.indexOf(overData);
    let store = clearArr.slice();
    moveInArray(store, fromIndex, toIndex);
    clearArr = store;
    params.api.setRowData(store);
    params.api.clearFocusedCell();
  }

  function moveInArray(arr, fromIndex, toIndex) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
}

const rowDragEnd = (params) => {
  defaultStore.onRowDragEnd(params, 1)
}
const refreshRows = (params) => {
  let buttons = document.createElement('span');
  buttons.classList.add('buttons__icons');
  buttons.innerHTML = `<button class="button-small btn__open" style="display: none"  data-row-idx="${params.data.id}">Открыть</button>`;
  let btnOpen = buttons.querySelector('.btn__open');
  let isPrimary = document.querySelectorAll('.is-primary');
  if (params.data.is_primary) {
    let showBtn = buttons.querySelector('.btn__open');
    showBtn.style.display = 'block';
  }
  if (isPrimary.length !== 0) {
    buttons.querySelector('.button-small').classList.remove('d-none');
    for (let i = 0; i <= isPrimary.length; i++) {
      if (isPrimary[i] !== undefined) {
        isPrimary[i].querySelector('.ag-row-drag').classList.add('d-none');
      }
    }
  }


  btnOpen.addEventListener('click', function () {
    openList(btnOpen, params);
  })

  return buttons;
}

function openList(btn, params) {
  let sell;
  let buy;
  if (params.data.id === Number(btn.getAttribute('data-row-idx'))) {
    buy = params.data.buyCurrency.code;
    sell = params.data.sellCurrency.code;
  }
  let items = cashStore.rowDataAll.value.filter(item => ([0].includes(item.is_primary) && [0].includes(item.is_archive)) && ([sell].includes(item.sellCurrency.code) && [buy].includes(item.buyCurrency.code)));

  items.sort(function (a, b) {
    return parseFloat(a.sort_order) - parseFloat(b.sort_order);
  });

  clearArr = cashStore.rowData.value.slice();
  for (let i = 0; i < items.length; i++) {
    let newItem = items[i];
    clearArr.push(newItem)
  }

  params.api.setRowData(clearArr);
}

const onCellEditingStopped = (params) => {
  let rowNode = params.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
  if (params.colDef.field !== undefined) {
    if (localStorage.getItem('merge-cash') === '1' || localStorage.getItem('merge-percentage-exchange') === '1') {
      cashStore.searchCurrencies(cashStore.rowData, params)
    } else {
      let data = JSON.stringify({
        id: params.data.id,
        field: params.colDef.field,
        value: params.value
      })
      console.log(data)
      updateTable.changeCourseCity(data)
      params.api.flashCells({rowNodes: [rowNode], columns: [params.colDef.field]});

    }
  }
}


const columnDefs = reactive({
  value: [
    {
      sortIndex: 0,
      headerName: '№',
      width: 86,
      rowDrag: true,
      field: 'buyCurrency.symbol',
      sort: 'asc',
      cellClass: (params) => {
        return params.data.is_primary === 1 ? 'is-primary' : ''
      },
      cellRenderer: params => {
        return refreshRows(params);
      }
    },
    {
      sortIndex: 1,
      headerName: 'НАЗВАНИЕ',
      minWidth: 60,
      field: 'title',
      sort: 'asc',
      cellRenderer: (params) => {
        return defaultStore.windowOpen(params)
      }
    },
    {
      sortIndex: 2,
      headerName: 'ГОРОД',
      width: 100,
      field: 'city.name_ru',
    },
    {
      sortIndex: 3,
      headerName: 'АКТИВНОСТЬ',
      width: 100,
      field: "active",
      cellRenderer: function (params) {
        return defaultStore.toggleCheckbox(params, false,)
      }
    },
    {
      headerName: 'КУРС',
      width: 120,
      field: 'rate',
      editable: true,
      cellClass: () => {
        return 'field-change';
      },
      cellRenderer: (params) => {
        if (params.data.is_set_exchange === '1' || params.data.is_set_exchange === 1) {
          return params.data.min_course
        } else if (params.data.is_set_max_exchange === '1' || params.data.is_set_max_exchange === 1) {
          return params.data.max_course
        } else {
          if (params.data.rate === null && (params.data.is_rate === 0 || params.data.is_rate === '0')) {
            if (params.node.data.course.sell >= 1 && params.node.data.course.sell <= 1) {
              return params.node.data.course.buy.toFixed(5);
            } else if (params.node.data.course.buy >= 1 && params.node.data.course.buy <= 1) {
              return params.node.data.course.sell.toFixed(5);
            }
          } else {
            return params.data.rate
          }
        }
      }
    },
    {
      sortIndex: 5,
      headerName: 'ТАРИФЫ',
      width: 120,
      field: 'course.rate_field',
      cellRenderer: (params) => {
        if (params.data.is_primary === 1) {
          let select = document.createElement('select');
          if (params.data.course.rate_field === null || params.data.course.rate_field === 'null' || params.data.course.rate_field === 'sell' || params.data.course.rate_field === 'buy') {
            select.className = 'rate-field';
            select.selected = params.data.course.rate_field;
            select.innerHTML = `
            <option value="null">Дефолт</option>
            <option value="sell">Отдаю</option>
            <option value="buy">Получаю</option>
            `
            for (let i = 0; i < select.length; i++) {
              if (select[i].value === `${params.data.course.rate_field}`) select[i].selected = true;
            }

            select.addEventListener('change', (e) => {
              let data = JSON.stringify({
                id: params.node.data.course.id,
                field: params.column.colId,
                value: e.target.value
              })
              console.log(data)
              updateTable.changeCourse(data)
            })
          } else {
            select.innerHTML = `
              <option>Поле не найдено</option>
            `
          }

          return select
        }
      }
    },
    {
      sortIndex: 6,
      headerName: 'ТОП КУРС БЭСТА',
      width: 120,
      field: "course.market_course",
    },
    {
      sortIndex: 7,
      headerName: 'МИН',
      width: 70,
      field: 'min_course',
      editable: true,
      cellClass: () => {
        return 'field-change';
      },
      cellRenderer: function (params) {
        return `${params.data.min_course}`
      }
    },
    {
      sortIndex: 8,
      headerName: 'МАКС',
      width: 70,
      field: "max_course",
      editable: true,
      cellClass: () => {
        return 'field-change';
      },
      cellRenderer: function (params) {
        return `${params.data.max_course}`
      }
    },
    {
      sortIndex: 9,
      headerName: 'ПРОЦЕНТ БИРЖИ +-',
      width: 100,
      suppressMovable: true,
      editable: false,
      field: "min_max_percent",
      valueSetter: (params)=> {
        if (params.oldValue && params.newValue) {
          if (params.oldValue !== String(params.newValue)) {
            params.newValue = String(params.newValue).replace(/,/, '.');
            params.data.min_max_percent = +params.newValue;
            coursesStore.calculationsData(params, false, null)
          }
        }
      },
      cellRenderer: function (params) {
        return defaultStore.buttonsRenderer(params, false)
      }
    },
    {
      sortIndex: 10,
      headerName: 'ПРИВЯЗАТЬ К БИРЖЕ ?',
      width: 100,
      field: "link_to_exchange",
      editable: false,
      cellRenderer: function (params) {
        return defaultStore.toggleCheckbox(params, false,)
      }
    },
    {
      sortIndex: 11,
      headerName: 'РУЧНОЙ КУРС',
      width: 120,
      field: "is_rate",
      cellRenderer: function (params) {
        return defaultStore.toggleCheckbox(params, false,)
      }
    },
    {
      sortIndex: 12,
      headerName: 'ПАРСИТЬ ГОРОД ?',
      width: 120,
      field: "is_rate_update",
      cellRenderer: function (params) {
        return defaultStore.toggleCheckbox(params, false,)
      }
    },
    {
      sortIndex: 13,
      headerName: 'ЭКСПОРТ МИН В КУРС',
      width: 120,
      field: 'is_set_exchange',
      cellRenderer: function (params) {
        return defaultStore.toggleCheckbox(params, false,)
      }
    },
    {
      sortIndex: 13,
      headerName: 'ЭКСПОРТ МАКС В КУРС',
      width: 120,
      field: 'is_set_max_exchange',
      cellRenderer: function (params) {
        return defaultStore.toggleCheckbox(params, false,)
      }
    },
    {
      sortIndex: 14,
      headerName: 'ИНСТРУМЕНТЫ',
      field: 'tools',
      width: 100,
      cellRenderer: params => {
        return cashStore.instruments(params)
      }
    },
  ],
});

// DefaultColDef sets props common to all Columns
const defaultColDef = {
  resizable: false,
};
onMounted(() => {
  document.title = 'Наличка';
  cashStore.receivingTable();
});

</script>
<template>
  <ag-grid-vue
          class="table"
          :columnDefs="columnDefs.value"
          :defaultColDef="defaultColDef"
          :rowData="cashStore.rowData.value"
          animateRows="true"
          :rowHeight="41"
          @grid-ready="onGridReady"
          @row-drag-move="onRowDragMove"
          @row-drag-end="rowDragEnd"
          @cell-editing-stopped="onCellEditingStopped"
          @model-updated="onModelUpdated">
  </ag-grid-vue>

</template>


<style lang="scss">
.buttons__icons {
  display: flex;
  column-gap: 10px;
  align-items: center;
  justify-content: center;
  height: 100%;

  & a {
    width: 14px;
    height: 13px;
    display: flex;
    text-decoration: none;
    color: #000;
  }
}


</style>