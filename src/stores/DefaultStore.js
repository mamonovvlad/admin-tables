import {defineStore} from "pinia";
import {ref} from "vue";
import axios from "axios";
import {useCurrenciesStore} from "@/stores/CurrenciesStore";
import {useCoursesStore} from "@/stores/CoursesStore";
import {useUpdateTable} from "@/stores/UpdateTable";
import {useCashStore} from "@/stores/CashStore";


export const useDefaultStore = defineStore('default', () => {
  const currenciesStore = useCurrenciesStore();
  const coursesStore = useCoursesStore();
  const updateTable = useUpdateTable();
  const cashStore = useCashStore();
  //store
  let courseSort = "course-template";
  let isShowInformation = ref(null);
  let citySort = "course-city";
  let themeTable = ref('ag-theme-alpine');
  let zoomTable = ref('1');
  let listColumns = ref([]);

  const getIdSelect = (e) => {
    localStorage.setItem('table-id', e.target.value)
    isShowInformation.value = e.target.value
    if (isShowInformation.value === '1') {
      currenciesStore.resetTimeout();
      document.title = 'Наличка';
    }
  }
  const tableDefinitions = () => {
    if (!localStorage.getItem('table-id')) {
      isShowInformation.value = '0';
      localStorage.setItem('table-id','0');
    }else {
      isShowInformation.value = localStorage.getItem('table-id');
    }
  };
  const deleteColumn = (cols) => {
    cols.forEach(item => {
      listColumns.value.push({
        id: item.sortIndex,
        name: item.headerName,
        checked: false
      })
    })
    if (localStorage.getItem("column-numbers")) {
      let saveHide = localStorage.getItem("column-numbers").split(',');
      for (let i = 0; i < saveHide.length; i++) {
        listColumns.value.forEach(item => {
          if (String(item.id) === saveHide[i]) {
            item.checked = true
          }
        })
        cols.forEach(item => {
          if (String(item.sortIndex) === saveHide[i]) {
            item.hide = true
          }
        })
      }
    }
  }
  const autoSize = (skipHeader, grid) => {
    let allColumnIds = [];
    grid.columnApi.getColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    grid.columnApi.autoSizeColumns(allColumnIds, skipHeader);
    localStorage.setItem('size', '0')
  }
  const maxSize = (grid) => {
    localStorage.setItem('size', '1')
    grid.api.sizeColumnsToFit();
  }
  const getThemeSelect = (e) => {
    localStorage.setItem('table-theme', e.target.value)
    themeTable.value = e.target.value
  }
  const themeDefinitions = () => {
    if (localStorage.getItem('table-theme') !== null) {
      themeTable.value = localStorage.getItem('table-theme')
    } else {
      themeTable.value = 'ag-theme-balham'
    }
  }
  const windowOpen = (params, city = false) => {
    const links = document.createElement("div");
    links.className = 'name';
    links.innerHTML = `
   ${city === false ? `<span> ${params.data.sellCurrency.name_ru} - ${params.data.buyCurrency.name_ru}</span>
        <a class='icon__table' href='https://dvigmakaki.xyz/course/view?id=${params.node.data.course.id}'  target='_blank'>
          <svg class="svg-inline--fa fa-eye" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="eye" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path class="" fill="currentColor" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
          </svg>
        </a>
        <a class='icon__table open-window' data-sell='${params.data.sellCurrency.code}' data-buy='${params.data.buyCurrency.code}'>
          <svg class="svg-inline--fa fa-chart-line" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chart-line" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
             <path class="" fill="currentColor" d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"></path>
          </svg>
         </a` :
      `<a class='icon__table open-window' data-city='${params.data.city.code}'  data-sell='${params.data.sellCurrency.code}' data-buy='${params.data.buyCurrency.code}'>
          <svg class="svg-inline--fa fa-chart-line" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chart-line" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path class="" fill="currentColor" d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V400c0 44.2 35.8 80 80 80H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H80c-8.8 0-16-7.2-16-16V64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"></path>
          </svg>
        </a>`
    }
  `
    let link = links.querySelector('.open-window')
    link.addEventListener('click', () => {
      if (city === false) {
        window.open("//bestchange.ru/" + params.data.sellCurrency.bestchange_code + '-to-' + params.data.buyCurrency.bestchange_code + ".html", 'example', 'width=1000,height=500');
      } else {
        window.open("//bestchange.ru/" + params.data.sellCurrency.bestchange_code + '-to-' + params.data.buyCurrency.bestchange_code + '-in-' + params.data.city.code.toLowerCase() + ".html", 'example', 'width=1000,height=500');
      }
    });

    return links;
  }
  const onRowDragEnd = (gridApi, number) => {
    let newArr = [];
    let count = gridApi.api.getDisplayedRowCount();
    if (number === 0) {
      for (let i = 0; i < count; i++) {
        let arr
        let rowNode = gridApi.api.getDisplayedRowAtIndex(i);
        rowNode.data.sort_order = rowNode.rowIndex;
        arr = rowNode.data.id + ':' + rowNode.data.sort_order;
        newArr.push(arr)
      }
    } else if (number === 1) {
      let arr
      let items = gridApi.node.parent.childrenAfterGroup;
      for (let i = 0; i <items.length; i++) {
        items[i].data.sort_order = items[i].rowIndex;
        arr = items[i].data.id + ':' + items[i].data.sort_order;
        newArr.push(arr)
      }
    }


    let data = newArr.join(',')
    let url = `${process.env.NODE_ENV === "development" ? process.env.VUE_APP_KEY_LOCAL : process.env.VUE_APP_KEY}/v1/${number === 1 ? citySort : courseSort}/set-sort-order-multiple-data?data=${data}&access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`;
    axios.get(url).then();
  }
  const buttonsRenderer = (params, updatingCurrencies) => {
    const buttons = document.createElement("div");
    buttons.className = 'min_max_percent'
    buttons.innerHTML = `
    <button class="button--small button-percent" data-sign="-">-</button>
        <span class="my-value"></span>
    <button class="button--small button-percent" data-sign="+">+</button>`;

    let eValue = buttons.querySelector('.my-value');
    let buttonPercent = buttons.querySelectorAll('.button-percent');
    if (updatingCurrencies === true) {
      eValue.innerHTML = params.data.course.min_max_percent === '' ? '0' : +params.data.course.min_max_percent;
    } else {
      eValue.innerHTML = params.data.min_max_percent === '' ? '0' : +params.data.min_max_percent;
    }
    eValue.setAttribute('data-index', `${params.rowIndex}`)
    eValue.setAttribute('data-sell-currency', `${params.data.sellCurrency.id}`)
    eValue.setAttribute('data-buy-currency', `${params.data.buyCurrency.id}`)
    //
    eValue.addEventListener("click", () => {
      params.colDef.editable = true;
    });


    buttonPercent.forEach(item => {
      item.addEventListener('click', (e) => {
        params.colDef.editable = false;
        editData(e.target.dataset.sign);
      })


      item.addEventListener('click', debounce((e) => {
        if (localStorage.getItem('merge-percentage-exchange') === '1' && updatingCurrencies === false ) {
          cashStore.searchCurrencies(cashStore.rowData, params)
          coursesStore.calculationsData(params, false, e.target.dataset.sign)
        } else {
          if (updatingCurrencies === true) {
            clearInterval(currenciesStore.timeout);
            coursesStore.calculationsData(params, updatingCurrencies, e.target.dataset.sign)
          } else {
            coursesStore.calculationsData(params, false, e.target.dataset.sign)
          }
          sendData();
        }
      }, 500));
    })


    function editData(sing) {
      calculator(sing)
      if (updatingCurrencies === true) {
        currenciesStore.pauseTimeout();
      }

    }


    function calculator(sing) {
      let number = Number(params.value);
      number = eval(`number
    ${sing}
    0.1`).toFixed(2);
      params.value = +number;
      if (updatingCurrencies === true) {
        params.data.course.min_max_percent = +number;
      } else {
        params.data.min_max_percent = +number;
      }
      params.eParentOfValue.querySelector('.my-value').innerHTML = +number;
    }

    function sendData() {
      let number = params.value;
      let data = JSON.stringify({
        id: updatingCurrencies === false ? params.node.data.id : params.node.data.course.id,
        field: params.column.colId,
        value: String(number)
      })


      if (updatingCurrencies === true) {
        currenciesStore.startTimeout();
        updateTable.changeCourse(data);
        console.log(data, 'changeCourse')
      } else if (updatingCurrencies === false) {
        updateTable.changeCourseCity(data);
        console.log(data, 'changeCourseCity')
      } else {
        return false
      }

    }
    return buttons
  }
  const debounce = (func, wait, immediate)=> {
    let time;
    return function () {
      let context = this,
        args = arguments;
      let later = function () {
        time = null;
        if (!immediate) func.apply(context, args);
      };
      let callNow = immediate && !time;
      clearTimeout(time);
      time = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    }
  }
  const toggleCheckbox = (params, updatingCurrencies, className = '') => {
    let input = document.createElement('input');
    let rowNode = params.api.getDisplayedRowAtIndex(params.node.rowIndex);
    input.type = "checkbox";
    input.className = `default-checkbox ${className}`
    input.checked = params.value === 1 || params.value === '1';


    input.addEventListener('change', function () {
      if (params.value === '0' || params.value === 0) {
        params.value = 1;
        } else {
          params.value = 0;
        }
        params.node.data.col = params.value;
        rowNode.setDataValue(params.column.colId, params.value)

        let data = JSON.stringify({
          id: updatingCurrencies === true ? params.data.course.id : params.data.id,
          field: params.column.colId,
          value: params.value
        })


        if (params.column.colId === 'course.is_active_limiter') {
          params.api.redrawRows({rowNodes: [rowNode], columns: ['course.limiter']});
          params.api.flashCells({rowNodes: [rowNode], columns: ['course.limiter']});
        }

      if (updatingCurrencies === true) {
        currenciesStore.startTimeout();
        updateTable.changeCourse(data);
      } else if (updatingCurrencies === false) {
        updateTable.changeCourseCity(data);
      } else {
        return false
      }
        params.api.flashCells({rowNodes: [rowNode], columns: [params.colDef.field]});
      }
    );
    return input;

  }

  const getterCourse =(params)=>{
    let sell = parseFloat(params.node.data.course.sell);
    let buy = parseFloat(params.node.data.course.buy);
    let buyCur = params.node.data.buyCurrency.id;
    let sellCur = params.node.data.sellCurrency.id;
    let usdId = ['1', '2', '6', '7', '8', '12', '28', '29', '30', '42'];
    let uahId = ['3', '5', '26', '31', '35', '43', '44', '45'];
    let rubId = ['9', '11', '13', '14', '15', '16', '17', '18', '23', '24', '37', '40'];

    if (usdId.includes(sellCur) && usdId.includes(buyCur) || uahId.includes(sellCur) && uahId.includes(buyCur) || rubId.includes(sellCur) && rubId.includes(buyCur)) {
      return course(5);
    } else {
      return course(5);
    }
    function course(number) {
      if (params.data.is_set_exchange === '1' || params.data.is_set_exchange === 1) {
        return params.data.min_course
      } else if (params.data.is_set_max_exchange === '1' || params.data.is_set_max_exchange === 1) {
        return params.data.max_course
      } else {
        if (sell >= 1 && sell <= 1) {
          return buy.toFixed(number);
        } else if (buy >= 1 && buy <= 1) {
          return sell.toFixed(number);
        }
      }
    }
  }
  const saveCourse =(params)=>{
    let sell = parseFloat(params.data.course.sell);
    let buy = parseFloat(params.data.course.buy);
    if (sell >= 1 && sell <= 1) {
      params.data.course.buy = params.newValue;
      let data = JSON.stringify({
        id: params.node.data.course.id,
        field: 'course.buy',
        value: params.newValue
      })

      updateTable.changeCourse(data);
      console.log(data)
      return params.newValue;
    } else if (buy >= 1 && buy <= 1) {
      params.data.course.sell = params.newValue;
      let data = JSON.stringify({
        id: params.node.data.course.id,
        field: 'course.sell',
        value: params.newValue
      })
      updateTable.changeCourse(data);
      console.log(data)
      return params.newValue;
    } else {
      return false
    }
  }
  // getters
  return {
    themeTable,
    zoomTable,
    listColumns,
    isShowInformation,
    saveCourse,
    getterCourse,
    getIdSelect,
    tableDefinitions,
    deleteColumn,
    autoSize,
    maxSize,
    debounce,
    themeDefinitions,
    getThemeSelect,
    windowOpen,
    onRowDragEnd,
    buttonsRenderer,
    toggleCheckbox
  }
})