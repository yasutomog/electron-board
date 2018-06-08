import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/dataload',
      name: 'data-load-page',
      component: require('@/components/DataLoadPage').default
    },
    {
      path: '/invoiceschart',
      name: 'invoices-chart-page',
      component: require('@/components/InvoicesChartPage').default
    },
    {
      path: '/boardapisettingpage',
      name: 'board-api-setting-page',
      component: require('@/components/BoardApiSettingPage').default
    },
    {
      path: '*',
      redirect: '/boardapisettingpage'
    }
  ]
})
