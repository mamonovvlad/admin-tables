import {defineStore} from "pinia";
import axios from "axios";

export const useUpdateTable = defineStore('update', () => {
  const changeCourse = (data) => {
    let url = encodeURIComponent(
        `${process.env.VUE_APP_KEY_SAVE}/v1/course/change-course?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
      ) +
      '&method=POST&data=' + encodeURIComponent(data);

    axios.post(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: data
      }
    ).then(function () {
    })

  }
  const changeMultiple = (data) => {
    let courses = {};
    courses.json = data;
    courses = JSON.stringify(courses);
    let url = encodeURIComponent(
        `${process.env.VUE_APP_KEY_SAVE}/v1/course/change-multiple-course?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
      ) +
      '&method=POST&data=' + encodeURIComponent(courses);
    axios.post(url, {

        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: courses,
      }
    ).then(function () {
    })

  }
  const changeCourseCity = (data) => {
    let url = encodeURIComponent(
        `${process.env.VUE_APP_KEY_SAVE}/v1/course-city/change?access-token=EFjko3OineBf8RQCth33wpC0dZqM4CyO&_format=json`
      ) +
      '&method=POST&data=' + encodeURIComponent(data);

    axios.post(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: data
      }
    ).then(function () {
    })
  }
  return {
    changeCourse,
    changeCourseCity,
    changeMultiple,
  }
})