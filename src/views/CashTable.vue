<script setup>
import {reactive, onMounted} from "vue";
import {AgGridVue} from "ag-grid-vue3";
import {useDefaultStore} from "@/stores/DefaultStore";
import {useCashStore} from "@/stores/CashStore";
import {useCoursesStore} from "@/stores/CoursesStore";
import {useUpdateTable} from "@/stores/UpdateTable";
import 'ag-grid-enterprise';

const defaultStore = useDefaultStore();
const coursesStore = useCoursesStore();
const cashStore = useCashStore();
const updateTable = useUpdateTable();

// let clearArr;

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

const onCellEditingStopped = (params) => {
  let rowNode = params.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
  if (params.colDef.field !== undefined) {
    if (localStorage.getItem('merge-cash') === '1' || localStorage.getItem('merge-percentage-exchange') === '1'|| localStorage.getItem('merge-btc-eth') === '1') {
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
      field: 'title',
      rowGroup: true,
      hide: true,
    },
    {
      rowGroup: true,
      hide: true,
      field: 'country.name_ru',
    },
    {
      headerName: 'ГОРОД',
      rowDrag: (params) => {
        if (params.node.data) {
          return true
        }
      },
      width: 100,
      field: 'city.name_ru',
    },
    {
      headerName: 'АКТИВНОСТЬ',
      width: 100,
      field: "active",
      cellRenderer: function (params) {
        if (params.node.data) {
          return defaultStore.toggleCheckbox(params, false,)
        }
      }
    },
    {
      headerName: 'КУРС',
      width: 120,
      field: 'rate',
      editable: true,
      cellClass: (params) => {
        if (params.node.data) {
          return 'field-change';
        }
      },
      cellRenderer: (params) => {
        if (params.node.data) {
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
      }
    },
    {
      headerName: 'ТАРИФЫ',
      width: 120,
      field: 'course.rate_field',
      cellRenderer: (params) => {
        if (params.node.data) {
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
      }
    },
    {
      sortIndex: 6,
      headerName: 'ТОП КУРС БЭСТА',
      width: 120,
      field: "course.market_course",
    },
    {
      headerName: 'МИН',
      width: 70,
      field: 'min_course',
      editable: true,
      cellClass: (params) => {
        if (params.node.data) {
          return 'field-change';
        }
      },
      cellRenderer: function (params) {
        if (params.node.data) {
          return `${params.data.min_course}`
        }
      }
    },
    {
      headerName: 'МАКС',
      width: 70,
      field: "max_course",
      editable: true,
      cellClass: (params) => {
        if (params.node.data) {
          return 'field-change';
        }
      },
      cellRenderer: function (params) {
        if (params.node.data) {
          return `${params.data.max_course}`
        }
      }
    },
    {
      headerName: 'ПРОЦЕНТ БИРЖИ +-',
      width: 100,
      suppressMovable: true,
      editable: false,
      field: "min_max_percent",
      valueSetter: (params)=> {
        if (params.node.data) {
          if (params.oldValue && params.newValue) {
            if (params.oldValue !== String(params.newValue)) {
              params.newValue = String(params.newValue).replace(/,/, '.');
              params.data.min_max_percent = +params.newValue;
              coursesStore.calculationsData(params, false, null)
            }
          }
        }
      },
      cellRenderer: function (params) {
        if (params.node.data) {
          return defaultStore.buttonsRenderer(params, false)
        }
      }
    },
    {
      headerName: 'ПРИВЯЗАТЬ К БИРЖЕ ?',
      width: 100,
      field: "link_to_exchange",
      editable: false,
      cellRenderer: function (params) {
        if (params.node.data) {
          return defaultStore.toggleCheckbox(params, false,)
        }
      }
    },
    {
      sortIndex: 11,
      headerName: 'РУЧНОЙ КУРС',
      width: 120,
      field: "is_rate",
      cellRenderer: function (params) {
        if (params.node.data) {
          return defaultStore.toggleCheckbox(params, false,)
        }
      }
    },
    {
      headerName: 'ПАРСИТЬ ГОРОД ?',
      width: 120,
      field: "is_rate_update",
      cellRenderer: function (params) {
        if (params.node.data) {
          return defaultStore.toggleCheckbox(params, false,)
        }
      }
    },
    {
      headerName: 'ЭКСПОРТ МИН В КУРС',
      width: 120,
      field: 'is_set_exchange',
      cellRenderer: function (params) {
        if (params.node.data) {
          return defaultStore.toggleCheckbox(params, false,)
        }
      }
    },
    {
      headerName: 'ЭКСПОРТ МАКС В КУРС',
      width: 120,
      field: 'is_set_max_exchange',
      cellRenderer: function (params) {
        if (params.node.data) {
          return defaultStore.toggleCheckbox(params, false,)
        }
      }
    },
    {
      headerName: 'ИНСТРУМЕНТЫ',
      field: 'tools',
      width: 100,
      cellRenderer: params => {
        if (params.node.data) {
          return cashStore.instruments(params.node.data)
        }
      }
    },
  ],
});

// DefaultColDef sets props common to all Columns
const defaultColDef = {
  resizable: true,
  sortable: true,
};
const autoGroupColumnDef = {
  minWidth: 300,
};

onMounted(() => {
  document.title = 'Наличка';
  coursesStore.gettingCourses();
  cashStore.receivingTable();
});

////////////////
function getRowId(params) {
  return params.data.id;
}

function onRowDragMove(event) {
  let movingNode = event.node;
  let overNode = event.overNode;
  let rowNeedsToMove = movingNode !== overNode;

  if (rowNeedsToMove) {
    let movingData = movingNode.data;
    let overData = overNode.data;


    let fromIndex = cashStore.rowData.value.indexOf(movingData);
    let toIndex = cashStore.rowData.value.indexOf(overData);


    let store = cashStore.rowData.value.slice();
    moveInArray(store, fromIndex, toIndex);

    cashStore.rowData.value = store;
    event.api.setRowData(store);
    // console.log(store)
    event.api.clearFocusedCell();

  }

  function moveInArray(arr, fromIndex, toIndex) {
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }
}

function rowDragEnd(params) {
  defaultStore.onRowDragEnd(params, 1)
}
</script>
<template>
  <ag-grid-vue
      class="table"
      :columnDefs="columnDefs.value"
      :autoGroupColumnDef="autoGroupColumnDef"
      :rowData="cashStore.rowData.value"
      :rowHeight="41"


      :animateRows="true"
      :getRowId="getRowId"
      :defaultColDef="defaultColDef"
      @grid-ready="onGridReady"
      @cell-editing-stopped="onCellEditingStopped"
      @model-updated="onModelUpdated"
      @row-drag-move="onRowDragMove"
      @row-drag-end="rowDragEnd"
  >
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