<script setup>
import TheTables from "@/components/sections/TheTables.vue";
import TheHeader from "@/components/sections/TheHeader.vue";
</script>

<template>
  <the-header></the-header>
  <the-tables></the-tables>

</template>


<style lang="scss">
[v-cloak] {
  display: none;
}

:root {
  --white: #fff;
  --dark: #000;
  --blue: #00458e;
  --light: #eaf0f6;
  --light-gray: #ced4da;
  --light-white: #f9f9f9;
  --light-dark: #1f1f1f;
  --radius: 4px
}

html {
  max-height: 100%;
  height: 100%;
}

body {
  font-weight: 400;
  font-size: 14px;
  margin: 0;
}

.table,
body {
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
}


.d-none{
  display: none !important;
}

.ag-theme-balham-dark {
  & .field-change:after {
    background: var(--light-dark);
  }

  & .ag-row-hover {
    &:before {
      background-color: #3d4662 !important;
      z-index: -1;
    }
  }

  & .ag-row-even {
    background: var(--light-dark);
  }

  & .icon__table {
    color: var(--white);
  }
}

.ag-theme-balham {
  & .field-change:after {
    background: var(--white);
  }

  & .ag-row-hover {
    &:before {
      background-color: #b6e7fd !important;
    }
  }

  & .ag-row-even {
    background: var(--light-white);
  }

  & .icon__table {
    color: var(--dark);
  }

}

.table {
  margin: 20px;


  & .ag-root-wrapper-body.ag-layout-normal {
    height: 100%;
  }

  & .ag-row-hover {
    &:before {
      z-index: -1;
    }
  }


  & .ag-ltr .ag-cell,
  & .name {
    display: flex;
    align-items: center;
    margin: 6px 0;
    height: 28px;
  }


  & .name {
    column-gap: 4px;
  }

  & .ag-cell-focus {
    border-color: transparent !important;

  }
}

.default-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.field-change {
  height: 28px !important;
  margin: 5px 0;
  display: flex !important;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 100%;
    border: 1px solid #b4b4b4;
    z-index: -1;
  }
}
.button--small{
  border-radius: var(--radius);
  background: var(--blue);
  color: var(--white);
  border: none;
  cursor: pointer;
  box-sizing: border-box;
  min-width: 22px;
  height: 22px;
}
.min_max_percent {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;


  & span {
    margin: 0 3px;
    display: flex;
    min-width: 40px;
    justify-content: center;
  }
}

.icon__table {
  display: inline-block;
  margin-left: 2px;

  svg {
    height: 12px;
  }
}
</style>
