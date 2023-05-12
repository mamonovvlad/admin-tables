import {defineStore} from "pinia";

export const useUpdateTable = defineStore('update', () => {
  const changeCourse = (data) => {
    let url = "/proxy.php?url="  +
      encodeURIComponent(
        `${process.env.VUE_APP_KEY_SAVE}/v1/course/change-course?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
      ) +
      '&method=POST&data=' + encodeURIComponent(data);

    fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: data
      }
    ).then(()=> {})
  }
  const changeMultiple = (data) => {
    let courses = {};
    courses.json = data;
    courses = JSON.stringify(courses);
    let url = "/proxy.php?url=" +
      encodeURIComponent(
        `${process.env.VUE_APP_KEY_SAVE}/v1/course/change-multiple-course?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
      ) +
      '&method=POST&data=' + encodeURIComponent(courses);

    fetch(url, {

        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: courses,
      }
    ).then(()=> {})

  }
  const changeCourseCity = (data) => {
    let url = "/proxy.php?url=" +
      encodeURIComponent(
        `${process.env.VUE_APP_KEY_SAVE}/v1/course-city/change?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
      ) +
      '&method=POST&data=' + encodeURIComponent(data);

    fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: data
      }
    ).then(()=> {})
  }
  return {
    changeCourse,
    changeCourseCity,
    changeMultiple,
  }
})