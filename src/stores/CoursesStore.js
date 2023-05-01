import {defineStore} from "pinia";
import axios from "axios";
import {ref} from "vue";

export const useCoursesStore =defineStore('courses',()=>{
  let courseUsdRub = ref(),
    courseUsdUah = ref(),
    courseEurUsd = ref(),
    courseUahRub = ref(),
    courseUsdKzt = ref(),
    courseRubKzt = ref(),
    courseUahKzt = ref(),
    courseEthEur = ref(),
    courseBtcEur = ref(),
    courseBtc = ref(),
    courseDash = ref(),
    courseZec = ref(),
    courseLtc = ref(),
    courseBnb = ref(),
    courseEth = ref(),
    courseDoge = ref(),
    courseTron = ref();

  const gettingCourses = () => {
    let url = `${process.env.VUE_APP_KEY}/v1/static-data?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`;
    axios.get(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    }).then(res => {
      for (let value of res.data) {
        let data;
        if (value.name === 'usd_uah_course') {
          courseUsdUah.value = Number(value.value);
        } else if (value.name === 'usd_rub_course') {
          courseUsdRub.value = Number(value.value);
        } else if (value.name === 'uah_rub_course') {
          courseUahRub.value = Number(value.value);
        } else if (value.name === 'eur_usd_course') {
          courseEurUsd.value = Number(value.value)
        } else if (value.name === 'usd_kzt_course') {
          courseUsdKzt.value = Number(value.value)
        } else if (value.name === 'rub_kzt_course') {
          courseRubKzt.value = Number(value.value)
        } else if (value.name === 'uah_kzt_course') {
          courseUahKzt.value = Number(value.value)
        } else if (value.name === 'bitcoin_course') {
          data = JSON.parse(value.value);
          courseBtc.value = Number(data.usd);
        } else if (value.name === 'dash_course') {
          data = JSON.parse(value.value);
          courseDash.value = Number(data.usd);
        } else if (value.name === 'zcash_course') {
          data = JSON.parse(value.value);
          courseZec.value = Number(data.usd);
        } else if (value.name === 'litecoin_course') {
          data = JSON.parse(value.value);
          courseLtc.value = Number(data.usd);
        } else if (value.name === 'ethereum_course') {
          data = JSON.parse(value.value);
          courseEth.value = Number(data.usd);
        } else if (value.name === 'dogecoin_course') {
          data = JSON.parse(value.value);
          courseDoge.value = Number(data.usd);
        } else if (value.name === 'tron_course') {
          data = JSON.parse(value.value);
          courseTron.value = Number(data.usd);
        } else if (value.name === 'bitcoin_euro_course') {
          data = JSON.parse(value.value);
          courseBtcEur.value = Number(data.usd);
        } else if (value.name === 'ethereum_euro_course') {
          data = JSON.parse(value.value);
          courseEthEur.value = Number(data.usd);
        } else if (value.name === 'bnb_course') {
          data = JSON.parse(value.value);
          courseBnb.value = Number(data.usd);
        }
      }
    });
  }

  const calculationsData = (params, updatingCurrencies, sing = null) => {
    const usdId = [1, 2, 6, 7, 8, 12, 28, 29, 30, 42];
    const uahId = [3, 5, 26, 31, 35, 43, 44, 45];
    const rubId = [9, 11, 13, 14, 15, 16, 17, 18, 23, 24, 37, 40];
    const eurId = [32, 48];
    const kztId = [50, 51];
    let rowNode = params.api.getDisplayedRowAtIndex(params.node.rowIndex);
    let buyCurrency = Number(params.node.data.buyCurrency.id);
    let sellCurrency = Number(params.node.data.sellCurrency.id);
    let rub;
    let usd;
    let uah;
    let eur;
    let kzt;

    function identificationIdentifier(id, name) {
      id.forEach(currency => {
        searchMatches(currency, name)
      });
    }

    identificationIdentifier(rubId, 'rub')
    identificationIdentifier(usdId, 'usd')
    identificationIdentifier(uahId, 'uah')
    identificationIdentifier(eurId, 'eur')
    identificationIdentifier(kztId, 'kzt')


//kzt
    if (kzt === sellCurrency && usd === buyCurrency || usd === sellCurrency && kzt === buyCurrency) {
      formulaDefault(courseUsdKzt.value)
    }

    if (kzt === sellCurrency && rub === buyCurrency || rub === sellCurrency && kzt === buyCurrency) {
      formulaDefault(courseRubKzt.value)
    }

    if (kzt === sellCurrency && uah === buyCurrency || uah === sellCurrency && kzt === buyCurrency) {
      formulaDefault(courseUahKzt.value)
    }

    //uah
    if (uah === sellCurrency && usd === buyCurrency || usd === sellCurrency && uah === buyCurrency) {
      formulaDefault(courseUsdUah.value)
    }
    if (uah === sellCurrency && rub === buyCurrency || rub === sellCurrency && uah === buyCurrency) {
      formulaDefault(courseUahRub.value)
    }
    //rub
    if (rub === sellCurrency && usd === buyCurrency || usd === sellCurrency && rub === buyCurrency) {
      formulaDefault(courseUsdRub.value)
    }
    //eur
    if (eur === sellCurrency && usd === buyCurrency || usd === sellCurrency && eur === buyCurrency) {
      formulaDefault(courseEurUsd.value)
    }

    let crypt = [
      {
        name: 'btc',
        value: 4,
        course: courseBtc.value
      }, {
        name: 'dash',
        value: 20,
        course: courseDash.value
      }, {
        name: 'zec',
        value: 21,
        course: courseZec.value
      }, {
        name: 'ltc',
        value: 19,
        course: courseLtc.value
      }, {
        name: 'eth',
        value: 25,
        course: courseEth.value
      }, {
        name: 'doge',
        value: 39,
        course: courseDoge.value
      }, {
        name: 'tron',
        value: 46,
        course: courseTron.value
      }, {
        name: 'bnb',
        value: 49,
        course: courseBnb.value
      },
    ]

    //Definition of currencies
    function definitionCurrencies(arr, curr, course, val) {
      for (let item of arr) {
        if (typeof item.value !== "undefined") {
          if (item.value === sellCurrency && curr === buyCurrency || curr === sellCurrency && item.value === buyCurrency) {
            if (curr === usd && (item.name === 'doge' || item.name === 'tron')) {
              let res = (1 / item.course);
              formulaDefault(res)
            } else if ((curr === eur || curr === usd) && (item.name === 'btc' || item.name === 'eth')) {
              let res = (item.course / courseEurUsd.value);
              formulaDefault(res)
            } else {
              formulaDefault(item.course, course, val);
            }
          }
        }
      }
    }

    // crypto
    definitionCurrencies(crypt, eur);
    definitionCurrencies(crypt, usd);
    definitionCurrencies(crypt, rub, courseUsdRub.value, 'crypt');
    definitionCurrencies(crypt, uah, courseUsdUah.value, 'crypt');
    definitionCurrencies(crypt, kzt, courseUsdKzt.value, 'crypt');

    function searchMatches(currency, name) {
      if (buyCurrency === currency || sellCurrency === currency) {
        if (name === "rub") {
          rub = currency;
        } else if (name === 'uah') {
          uah = currency;
        } else if (name === 'usd') {
          usd = currency;
        } else if (name === 'eur') {
          eur = currency;
        } else if (name === 'kzt') {
          kzt = currency;
        }
      }
    }

    function formulaDefault(mainCourse, course, value) {
      params.value = updatingCurrencies === true ? params.data.course.min_max_percent : params.data.min_max_percent;
      let res
      if (sing === '+') {
        res = (mainCourse + (0.01 * mainCourse * (Number(params.value) - 0.1)) + (mainCourse * 0.001)).toFixed(4);
        if (value === 'crypt') {
          res = (mainCourse + (0.01 * mainCourse * (Number(params.value) - 0.1)) + (mainCourse * 0.001));
          res = (res * course).toFixed(4);
        }
      } else if (sing === '-') {
        res = (mainCourse + (0.01 * mainCourse * (Number(params.value) + 0.1)) - (mainCourse * 0.001)).toFixed(4);
        if (value === 'crypt') {
          res = (mainCourse + (0.01 * mainCourse * (Number(params.value) + 0.1)) - (mainCourse * 0.001));
          res = (res * course).toFixed(4);
        }
      } else {
        res = (mainCourse + (mainCourse * (Number(params.value) / 100))).toFixed(4);
        if (value === 'crypt') {
          res = (mainCourse + (mainCourse * (Number(params.value) / 100)))
          res = (res * course).toFixed(4);
        }
      }

      updateMinMaxCourse(params, rowNode, res, updatingCurrencies);
      params.api.flashCells({rowNodes: [rowNode], columns: [`${params.colDef.field}`]});
    }
  }
  const updateMinMaxCourse = (params, rowNode, res, updatingCurrencies) => {
    if (updatingCurrencies === true) {
      if (params.data.course.min_course !== "1" && params.data.course.min_course !== 1) {
        rowNode.setDataValue('course.min_course', res);
      } else if (params.data.course.max_course !== "1" && params.data.course.max_course !== 1) {
        rowNode.setDataValue('course.max_course', res);
      }
    } else if (updatingCurrencies === false) {
      if (params.data.min_course !== "1" && params.data.min_course !== 1) {
        rowNode.setDataValue('min_course', res);
      } else if (params.data.max_course !== "1" && params.data.max_course !== 1) {
        rowNode.setDataValue('max_course', res);
      }
    }
  }

  return{
    gettingCourses,
    calculationsData
  }
})