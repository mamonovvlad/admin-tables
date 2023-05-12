import {defineStore} from "pinia";
import axios from "axios";
import {reactive, ref} from "vue";
import { useUpdateTable } from "@/stores/UpdateTable";

export const useCashStore = defineStore('cash', () => {
  const gridApi = ref(null);
  const rowData = reactive({});
  const rowDataAll = reactive({});
  const updateTable = useUpdateTable();
  const receivingTable = () => {
    let url = `${process.env.NODE_ENV === "development" ? process.env.VUE_APP_KEY_LOCAL : process.env.VUE_APP_KEY}/v1/course-city/all?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
    axios.get(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    }).then(res => {
      if (res.data !== undefined) {
        rowDataAll.value = res.data;
        rowData.value = rowDataAll.value.filter(item => [1].includes(item.is_primary) && [0].includes(item.is_archive));
      }

    });
  }
  const instruments = (params) => {
    let buttons = document.createElement('span')
    buttons.classList.add('buttons__icons')
    buttons.innerHTML = `
    <a href="/course-city/view?id=${params.data.id}" target="_blank" title="Просмотр" >
      <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
        <path class="" fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
      </svg>
     </a>
    <a href="/course-city/update?id=${params.data.id}" target="_blank" title="Редактировать">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/>
      </svg>
    </a>
    <a href="/course-city/delete?id=${params.data.id}"  target="_blank" title="Удалить" data-method="POST">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/>
      </svg>
    </a>
  `
    return buttons;
  }

  const searchCurrencies = (res, par)=> {
    updateMerge(par.data.id, par)
    res.value.forEach(item => {
      if (item.city && par.data.city) {
        if (item.city.code === par.data.city.code) {
          if (par.data.buyCurrency.code === "CASHUSD" && item.buyCurrency.code === "CASHUSD" || par.data.buyCurrency.code === "CASHEUR" && item.buyCurrency.code === "CASHEUR") {
            if (par.data.sellCurrency.code === "USDTERC20" && item.sellCurrency.code === "USDTTRC20" || par.data.sellCurrency.code === "USDTTRC20" && item.sellCurrency.code === "USDTERC20") {
              updateMerge(item.id, par)
            }
          } else if (par.data.sellCurrency.code === "CASHUSD" && item.sellCurrency.code === "CASHUSD" || par.data.sellCurrency.code === "CASHEUR" && item.sellCurrency.code === "CASHEUR") {
            if (par.data.buyCurrency.code === "USDTERC20" && item.buyCurrency.code === "USDTTRC20" || par.data.buyCurrency.code === "USDTTRC20" && item.buyCurrency.code === "USDTERC20") {
              updateMerge(item.id, par)
            }
          }
        }
      }
    })
    // Update data table
    par.api.forEachNode((rowNode) => {
      if (rowNode.data.city && par.data.city) {
        if (rowNode.data.city.code === par.data.city.code) {
          if (par.data.buyCurrency.code === "CASHUSD" && rowNode.data.buyCurrency.code === "CASHUSD" || par.data.buyCurrency.code === "CASHEUR" && rowNode.data.buyCurrency.code === "CASHEUR") {
            if (par.data.sellCurrency.code === "USDTERC20" && rowNode.data.sellCurrency.code === "USDTTRC20" || par.data.sellCurrency.code === "USDTTRC20" && rowNode.data.sellCurrency.code === "USDTERC20") {
              if (localStorage.getItem('merge-cash') === '1' && par.colDef.field === 'rate') {
                rowNode.setDataValue([`rate`], par.data.rate)
                par.api.flashCells({rowNodes: [rowNode], columns: ['rate']});
              } else if (localStorage.getItem('merge-percentage-exchange') === '1' && par.colDef.field === 'min_max_percent') {
                rowNode.setDataValue([`min_max_percent`], par.data.min_max_percent)
                par.api.flashCells({rowNodes: [rowNode], columns: ['min_max_percent']});
              }
            }
          } else if (par.data.sellCurrency.code === "CASHUSD" && rowNode.data.sellCurrency.code === "CASHUSD" || par.data.sellCurrency.code === "CASHEUR" && rowNode.data.sellCurrency.code === "CASHEUR") {
            if (par.data.buyCurrency.code === "USDTERC20" && rowNode.data.buyCurrency.code === "USDTTRC20" || par.data.buyCurrency.code === "USDTTRC20" && rowNode.data.buyCurrency.code === "USDTERC20") {
              if (localStorage.getItem('merge-cash') === '1' && par.colDef.field === 'rate') {
                rowNode.setDataValue([`rate`], par.data.rate)
                par.api.flashCells({rowNodes: [rowNode], columns: ['rate']});
              } else if (localStorage.getItem('merge-percentage-exchange') === '1' && par.colDef.field === 'min_max_percent') {
                rowNode.setDataValue([`min_max_percent`], par.data.min_max_percent)
                par.api.flashCells({rowNodes: [rowNode], columns: ['min_max_percent']});
              }
            }
          }
        }
      }
    });
  }

  const updateMerge = (id, value) => {
    if (localStorage.getItem('merge-cash') === '1' && value.colDef.field === 'rate') {
      let data = JSON.stringify({
        id: id,
        field: 'rate',
        value: value.data.rate
      })
      console.log(data)
      updateTable.changeCourseCity(data)
    } else if (localStorage.getItem('merge-percentage-exchange') === '1' && value.colDef.field === 'min_max_percent') {
      let data = JSON.stringify({
        id: id,
        field: 'min_max_percent',
        value: value.data.min_max_percent
      })
      console.log(data)
      updateTable.changeCourseCity(data)
    } else {
      return false;
    }

  }

  return {
    rowData,
    rowDataAll,
    gridApi,
    searchCurrencies,
    receivingTable,
    instruments
  }
})