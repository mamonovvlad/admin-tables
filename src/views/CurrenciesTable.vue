<script setup>
import { reactive, onMounted} from "vue";
import {AgGridVue} from "ag-grid-vue3";
import {useCurrenciesStore} from "@/stores/CurrenciesStore";
import {useDefaultStore} from "@/stores/DefaultStore";
import {useCoursesStore} from "@/stores/CoursesStore";
import {useUpdateTable} from "@/stores/UpdateTable";

const currenciesStore = useCurrenciesStore();
const defaultStore = useDefaultStore();
const coursesStore = useCoursesStore();
const updateTable = useUpdateTable();


const onGridReady = (params) => {
  currenciesStore.gridApi = params;
  defaultStore.deleteColumn(params.columnApi.columnModel.columnDefs)
  if (localStorage.getItem('size') === '1') {
    defaultStore.maxSize(params);
  } else {
    defaultStore.autoSize(false, params);
  }
};
const rowDragEnd = (params) => {
  defaultStore.onRowDragEnd(params, 0)
}
const onCellEditingStarted = () => {
  currenciesStore.pauseTimeout();
}
const onCellEditingStopped = (params) => {
  currenciesStore.startTimeout();
  let rowNode = params.api.getDisplayedRowAtIndex(params.node.rowIndex);
  params.api.flashCells({rowNodes: [rowNode], columns: [params.colDef.field]});
  if (params.colDef.field !== 'course') {
    let data = JSON.stringify({
      id: params.node.data.course.id,
      field: params.column.colId,
      value: params.value
    })
    console.log(data)
    updateTable.changeCourse(data);
  }

}


const columnDefs = reactive({
  value: [
    {
      sortIndex: 0,
      headerName: '№',
      width: 70,
      field: 'number',
      rowDrag: true,
      cellRenderer: params => {
        return '' + ++params.rowIndex;
      }
    },
    {
      sortIndex: 1,
      headerName: 'НАПРАВЛЕНИЕ',
      minWidth: 60,
      field: 'direction',
      cellRenderer: (params) => {
        return defaultStore.windowOpen(params)
      }
    },
    {
      sortIndex: 2,
      headerName: 'КУРС',
      width: 70,
      field: 'course',
      cellClass: 'field-change',
      valueGetter: function (params) {
      return defaultStore.getterCourse(params)
      },
      valueSetter: function (params) {
        return defaultStore.saveCourse(params)
      },
      editable: true,
    },
    {
      sortIndex: 3,
      headerName: 'ТОР КУРС БЭСТА',
      width: 100,
      field: "course.market_course",
    },
    {
      sortIndex: 4,
      headerName: 'МИН',
      width: 70,
      field: 'course.min_course',
      editable: params => {
        if (params.data.is_edit_min === "1") {
          return true
        }
      },
      cellClass: params => {
        return params.data.is_edit_min === "1" ? 'field-change' : 'text-center';
      },
      cellRenderer: function (params) {
        return `${params.data.course.min_course}`
      }
    },
    {
      sortIndex: 5,
      headerName: 'МАКС',
      width: 70,
      field: "course.max_course",
      editable: params => {
        if (params.data.is_edit_max === "1") {
          return true
        }
      },
      cellClass: params => {
        return params.data.is_edit_max === "1" ? 'field-change' : 'text-center';
      },
      cellRenderer: function (params) {
        return `${params.data.course.max_course}`
      }
    },
    {
      sortIndex: 6,
      headerName: 'ОГРАНИЧИТЕЛЬ',
      width: 120,
      field: "course.limiter",
      editable: params => {
        return params.data.course.is_active_limiter === "1" ? true : '';
      },
      cellClass: params => {
        return params.data.course.is_active_limiter === "1" ? 'field-change' : 'text-center';
      },
      cellRenderer: function (params) {
        if (params.node.data.course.is_active_limiter === "1") {
          return `${params.data.course.limiter}`
        } else {
          return `—`
        }
      }
    },
    {
      sortIndex: 7,
      headerName: 'ОГРАНИЧИВАТЬ ?',
      width: 100,
      field: "course.is_active_limiter",
      cellRenderer: function (params) {
        return defaultStore.toggleCheckbox(params, true,)
      },
    },
    {
      sortIndex: 8,
      headerName: 'ПРОЦЕНТ БИРЖИ +-',
      width: 116,
      field: "course.min_max_percent",
      editable: true,
      valueSetter: function (params) {
        if (params.oldValue !== params.newValue) {
          params.newValue = params.newValue.replace(/,/, '.');
          params.data.course.min_max_percent = params.newValue;
          coursesStore.calculationsData(params,true, null, )
        }
      },
      cellRenderer: function (params) {
        return defaultStore.buttonsRenderer(params, true)
      }
    },
    {
      sortIndex: 9,
      headerName: 'ПРИВЯЗАТЬ К БИРЖЕ ?',
      width: 100,
      field: "course.link_to_exchange",
      cellRenderer: function (params) {
        return bindingCheckbox(params)
      }
    },
    {
      sortIndex: 10,
      headerName: 'ЗНАЧЕНИЕ УК',
      width: 100,
      field: "course.smart_percent",
      editable: true,
      cellClass: 'field-change',
    },
    {
      sortIndex: 11,
      headerName: 'УМНЫЙ КУРС',
      width: 100,
      field: 'course.is_smart',
      cellRenderer: function (params) {
        return bindingCheckbox(params)
      }
    },
    {
      sortIndex: 12,
      headerName: 'ПАРСИТЬ ?',
      width: 100,
      field: 'course.is_parse',
      cellRenderer: function (params) {
        return defaultStore.toggleCheckbox(params, true)
      }
    },
    {
      sortIndex: 13,
      headerName: 'ЗНАЧЕНИЕ ПАРСЕРА 2',
      width: 100,
      field: "course.parse_populate_value",
      editable: true,
      cellClass: 'field-change',
    },
    {
      sortIndex: 14,
      headerName: 'ПАРСИТЬ 2?',
      width: 100,
      field: "course.is_parse_populate",
      cellRenderer: function (params) {
        return defaultStore.toggleCheckbox(params, true)
      }
    },
    {
      sortIndex: 15,
      headerName: 'ЗНАЧЕНИЕ ПАРСЕРА 3',
      width: 100,
      field: "course.parse_superpopulate_value",
      editable: true,
      cellClass: 'field-change',
    },
    {
      sortIndex: 16,
      headerName: 'ПАРСИТЬ 3?',
      width: 100,
      field: "course.is_parse_superpopulate",
      cellRenderer: function (params) {
        return defaultStore.toggleCheckbox(params, true)
      }
    },
  ],
});

const defaultColDef = {
  resizable: true,
};

const bindingCheckbox = (params) => {
  let input = document.createElement('input');
  let columnClass = params.colDef.field.split('course.').join('');
  let rowNode = params.api.getDisplayedRowAtIndex(`${params.node.rowIndex}`);
  input.type = "checkbox";
  input.checked = params.value === "1";
  input.className = `default-checkbox check ids-${params.data.sellCurrency.id}-${params.data.buyCurrency.id} column-${columnClass}`;
  input.setAttribute('data-sell', `${params.data.sellCurrency.id}`)
  input.setAttribute('data-buy', `${params.data.buyCurrency.id}`)
  input.setAttribute('data-id', `${params.node.data.course.id}`)
  input.setAttribute('data-index', `${rowNode.id}`)


  if (params.data.course.link_to_exchange === '1') {
    input.classList.add('change--true');
  } else {
    input.classList.remove('change--true');
  }

  input.addEventListener('change', function () {

    let nameColumn = columnClass;
    if (this.classList.contains('column-is_smart')) {
      nameColumn = "link_to_exchange";
    } else if (this.classList.contains('column-link_to_exchange')) {
      nameColumn = 'is_smart'
    }

    let reverseCheckboxBuySell = document.querySelectorAll('.ids-' + input.getAttribute('data-sell') + '-' + input.getAttribute('data-buy') + '.column-' + nameColumn)
    let reverseCheckboxSellBuy = document.querySelectorAll('.ids-' + input.getAttribute('data-buy') + '-' + input.getAttribute('data-sell') + '.column-' + nameColumn)

    let checkboxBuySell = document.querySelectorAll('.ids-' + input.getAttribute('data-buy') + '-' + input.getAttribute('data-sell') + '.column-' + columnClass)
    let checkboxSellBuy = document.querySelectorAll('.ids-' + input.getAttribute('data-sell') + '-' + input.getAttribute('data-buy') + '.column-' + columnClass)


    checkboxBuySell.forEach(item => {
      if (!item.checked) {
        item.checked = true;
        item.classList.add('change--true');
        params.value = 1;
      } else {
        item.checked = false;
        item.classList.remove('change--true');
        params.value = 0;
      }
      let data = JSON.stringify({
        id: params.node.data.course.id,
        field: params.column.colId,
        value: params.value
      })
      console.log(data)
      updateTable.changeCourse(data);
    })
    checkboxSellBuy.forEach(item => {
      if (item.checked) {
        item.checked = true;
        params.value = '1';
        item.classList.add('change--true');
      } else {
        item.checked = false;
        params.value = "0";
        item.classList.remove('change--true');
      }
      let data = JSON.stringify({
        id: item.getAttribute('data-id'),
        field: params.column.colId,
        value: params.value
      })
      console.log(data)
      updateTable.changeCourse(data);
    })

    reverseCheckboxBuySell.forEach(item => {
      item.checked = false;
      params.value = '0';
      item.classList.remove('change--true');
    })
    reverseCheckboxSellBuy.forEach(item => {
      item.checked = false;
      item.classList.remove('change--true');
      params.value = "0";
    })

  })
  return input
}
onMounted(() => {
  currenciesStore.receivingUsers();
})
</script>
<template>
  <ag-grid-vue
      class="table"
      :columnDefs="columnDefs.value"
      :rowData="currenciesStore.rowData.value"
      :defaultColDef="defaultColDef"
      enableCellChangeFlash="true"
      rowDragManaged="true"
      singleClickEdit="true"
      animateRows="true"
      :rowHeight="41"
      @grid-ready="onGridReady"
      @row-drag-end="rowDragEnd"
      @cell-editing-started="onCellEditingStarted"
      @cell-editing-stopped="onCellEditingStopped">
  </ag-grid-vue>
</template>
