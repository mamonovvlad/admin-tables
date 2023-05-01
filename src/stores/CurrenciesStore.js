import {defineStore} from "pinia";
import axios from "axios";
import {reactive, ref} from "vue";
import {useCoursesStore} from "@/stores/CoursesStore";

export const useCurrenciesStore = defineStore('currencies', () => {
  const coursesStore = useCoursesStore();
  //store
  let gridApi = ref(null);
  let rowData = reactive({});
  let users = ref([]);
  let templates = ref([]);
  let userId = ref();
  let templateId = ref();
  let seconds = ref(20);
  let timeout;
  //methods
  const refreshAll = () => {
    coursesStore.gettingCourses();
    receivingTable();
  }
  const startTimeout = () => {
    timeout = setInterval(timer, 1000);
  }
  const resetTimeout = () => {
    seconds.value = 20;
    clearInterval(timeout);
  }
  const pauseTimeout = () => {
    clearInterval(timeout);
  }
  function timer() {
    seconds.value--;
    if (seconds.value <= 0) {
      clearInterval(timeout);
      seconds.value = 20;
      startTimeout();
      refreshAll();
    }
  }
  function receivingUsers() {
    let url = `${process.env.VUE_APP_KEY}/v1/admin?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`

    axios.get(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    }).then(res => {
      users.value = res.data;
      if (localStorage.getItem('user-id') === null) {
        localStorage.setItem('user-id', res.data[0].id)
      }
      userId.value = localStorage.getItem('user-id')
      startTimeout();
      coursesStore.gettingCourses();
      receivingTemplate();
    });

  }
  function receivingTemplate(clearTemplate = false) {
    let url = `${process.env.VUE_APP_KEY}/v1/course-template/list-templates?user_id=${userId.value}&access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
    axios.get(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    }).then(res => {
      if (res.data.data.length !== 0) {
        templates.value = res.data.data.filter(item => [1].includes(item.active) || ['1'].includes(item.active));
        if (localStorage.getItem('template-id') === null || clearTemplate === true) {
          localStorage.setItem('template-id', res.data.data[0].id);
        }
        templateId.value = localStorage.getItem('template-id');

        for (let item of templates.value) {
          if (item.id === templateId.value) {
            document.title = item.name;
            break;
          }
        }
      } else {
        templates.value = []
      }
      if (userId.value && templateId.value) {
        receivingTable()
      }

    });
  }
  function receivingTable() {
    let url = `${process.env.VUE_APP_KEY}/v1/course-template/templates?user_id=${userId.value}&id=${templateId.value}&access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
    axios.get(url)
      .then(res => {
        if (res.data !== undefined) {
          rowData.value = res.data.data
        } else {
          return false;
        }
      });
  }


  return {
    receivingUsers,
    receivingTemplate,
    resetTimeout,
    pauseTimeout,
    startTimeout,
    gridApi,
    seconds,
    timeout,
    rowData,
    users,
    userId,
    templates,
    templateId,

  }

})