<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <h1 class="title">
          請求データ
        </h1>
        <h2 class="subtitle">
          請求データのChart
        </h2>
      </div>
    </section>
    <div class="columns">
      <div class="column">
        <nav class="panel left">
          <p class="panel-heading">
            受注ステータスごとの請求金額
          </p>
          <div class="panel-block">
            <canvas id="invoicesChart1" width="400" height="300"></canvas>
          </div>
        </nav>
      </div>
      <div class="column">
        <nav class="panel right">
          <p class="panel-heading">
            月別の受注済金額
          </p>
          <div class="panel-block">
            <canvas id="invoicesChart2" width="400" height="300"></canvas>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
  import chart from 'chart.js'
  import { mapGetters } from 'vuex'
  import * as chartUtil from '../common/chartUtil'
  import bigNumber from 'bignumber.js'
  export default {
    name: 'invoices-chart-page',
    mounted() {

      const vm = this

      let invoices = vm.$store.getters.boardInvoices
      let invoiceKeys = vm.$store.getters.boardDataKeys

      if (invoices && invoiceKeys) {

        vm.showChart(invoices)

      }

    },
    computed: {
      ...mapGetters([
        'boardInvoices'
      ])
    },
    watch: {
      boardInvoices: function(dates) {
        this.showChart(dates)
      }
    },
    methods: {
      showChart(dates) {

        let vm = this
        let invoices = dates
        let invoiceKeys = vm.$store.getters.boardDataKeys

        let chartColors = [
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(201, 203, 207, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(32, 241, 13, 0.2)",
          "rgba(61, 190, 90, 0.2)",
          "rgba(141, 141, 99, 0.2)",
          "rgba(209, 5, 10, 0.2)"
        ]

        let datasets = []
        for (let i = 0, len = invoiceKeys.length; i < len; i++) {

          let key = invoiceKeys[i]
          let color = chartColors[i]
          let val = vm.getValuesByOrderStatus(invoices[key])

          datasets.push({
            label: key,
            backgroundColor: color,
            data: val.amounts,
            count: val.counts
          })

        }
        
        let invoicesChart = document.querySelector('#invoicesChart1')
        let data = {
          labels: ["見積中(高)", "見積中(中)", "見積中(低)", "見積中(除)", "受注確定", "受注済", "失注"],
          datasets: datasets
        }

        new chart(invoicesChart, {
          type: 'bar',
          data: data,
          options: {
            title: {
              display: false,
              text: '受注ステータスごとの請求金額'
            },
            barValueSpacing: 20,
            maintainAspectRatio: false,
          tooltips: {
            callbacks: {
              label: chartUtil.makeTooltipByAmountAndCount
            }
          },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  userCallback: chartUtil.formatNumber
                }
              }]
            }
          }
        })


        let amounts = []
        for (let i = 0, len = invoiceKeys.length; i < len; i++) {

          let key = invoiceKeys[i]
          let monthInvoice = invoices[key]
          let amount = 0
          monthInvoice.forEach(function(mi) {

            if (mi.order_status === 5) {
              amount = bigNumber(amount).plus(Number(mi.total)).plus(Number(mi.tax))
            }

          })

          amounts.push(amount)

        }

        let invoicesChart2 = document.getElementById('invoicesChart2')
        new chart(invoicesChart2, {
          type: 'line',
          data: {
            labels: invoiceKeys,
            datasets: [{
              label: '受注済金額',
              backgroundColor: "rgb(255, 99, 132)",
              borderColor: "rgb(255, 99, 132)",
              data: amounts,
              fill: false,
            }]
          },
          options: {
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            scales: {
              xAxes: [{
                display: true
              }],
              yAxes: [{
                display: true,
                ticks: {
                  beginAtZero: true,
                  userCallback: chartUtil.formatNumber
                }
              }]
            }
          }
        })

      },
      getValuesByOrderStatus(res) {

        // 受注ステータス
        let orderStatuses = [{
          value: 1,
          name: '見積中(高)',
          count: 0,
          amount: 0
        }, {
          value: 2,
          name: '見積中(中)',
          count: 0,
          amount: 0
        }, {
          value: 3,
          name: '見積中(低)',
          count: 0,
          amount: 0
        }, {
          value: 8,
          name: '見積中(除)',
          count: 0,
          amount: 0
        }, {
          value: 4,
          name: '受注確定',
          count: 0,
          amount: 0
        }, {
          value: 5,
          name: '受注済',
          count: 0,
          amount: 0
        }, {
          value: 9,
          name: '失注',
          count: 0,
          amount: 0
        }]

        return chartUtil.translateForChart(res, 'order_status', orderStatuses, [5])

      },
      getValuesByInvoiceStatus(res) {

        // 請求ステータス
        let invoiceStatuses = [{
          value: 1,
          name: '未請求',
          count: 0,
          amount: 0
        }, {
          value: 4,
          name: '請求OK',
          count: 0,
          amount: 0
        }, {
          value: 2,
          name: '請求済',
          count: 0,
          amount: 0
        }, {
          value: 3,
          name: '入金済',
          count: 0,
          amount: 0
        }, {
          value: 9,
          name: '回収不能',
          count: 0,
          amount: 0
        }]

        return chartUtil.translateForChart(res, 'invoice_status', invoiceStatuses, [2, 3])

      }
    },
  }
</script>

<style scoped lang="scss">
  .columns {
    padding-top: 0.75rem;
    nav.left {
      padding: 0 0 0 0.75rem;
    }
    nav.right {
      padding: 0 0.75rem 0 0;
    }
  }
  @media (max-width: 768px) {
    .columns {
      nav.left {
        padding: 0 0.75rem;
      }
      nav.right {
        padding: 0 0.75rem;
      }
    }
  }

</style>
