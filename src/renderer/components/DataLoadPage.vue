<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            データ取込
          </h1>
          <h2 class="subtitle">
            Boart APIに接続してChartに必要なデータを取り込みます
          </h2>
        </div>
      </div>
    </section>
    <b-field>
      <button class="button is-info" v-on:click="loadData">
        API接続
      </button>
    </b-field>
    <b-loading :is-full-page="isFullPage" :active.sync="isLoading" :canCancel="false"></b-loading>
  </div>
</template>

<script>
  import db from '../datastore'
  import * as api from '../common/api'
  export default {
    name: 'data-load-page',
    data() {
      return {
        isLoading: false,
        isFullPage: true,
        apiInfoInvoices: [],
        apiInfoPayments: []
      }
    },
    mounted() {
    },
    methods: {
      /**
       * APIから取得した請求データをDB保存
       *
       * @param dates APIから取得した請求データ
       * @returns {Promise<void>}
       */
      async updateInvoicesForDB(dates) {

        let vm = this

        return new Promise((resolve, reject) => {

          db.update({
            name: 'board-invoices'
          }, {
            name: 'board-invoices',
            dates: dates
          }, {
            upsert: true
          }, function (err, numReplaced, upsert) {

            if (err === null) {

              vm.$toast.open({
                message: '保存しました'
              })

              resolve({
                name: 'board-invoices',
                dates: dates
              })

            } else {

              vm.$toast.open({
                message: '保存に失敗しました',
                type: 'is-danger'
              })

              reject()

            }

          });

        });

      },
      /**
       * APIから取得した支払データをDB保存
       *
       * @param dates APIから取得した支払データ
       * @returns {Promise<void>}
       */
      async updatePaymentsForDB(dates) {

        let vm = this

        return new Promise((resolve, reject) => {

          db.update({
            name: 'board-payments'
          }, {
            name: 'board-payments',
            dates: dates
          }, {
            upsert: true
          }, function (err, numReplaced, upsert) {

            if (err === null) {

              vm.$toast.open({
                message: '保存しました'
              })

              resolve({
                name: 'board-invoices',
                dates: dates
              })

            } else {

              vm.$toast.open({
                message: '保存に失敗しました',
                type: 'is-danger'
              })

              reject()

            }

          });

        });

      },
      /**
       * 請求データの取得
       *
       * @param searchFilterDates 請求データ取得APIの検索条件
       */
      async getInvoices(searchFilterDates) {

        let vm = this

        vm.isLoading = true

        let dates = {}
        for (let i = 0; i < searchFilterDates.length; i++) {

          let searchFilterDate = searchFilterDates[i]

          let invoicesByMonth = await vm.getInvoicesByMonth(searchFilterDate)

          // 年月（yyyy-MM）をKEYとしてデータを保持
          dates[searchFilterDate.firstDate.substr(0, 7)] = invoicesByMonth

          vm.apiInfoInvoices.push({
            from: searchFilterDate.firstDate,
            to: searchFilterDate.lastDate,
            cnt: invoicesByMonth.length
          })

          // API制限のためwait処理
          await api.wait(1000)

        }

        let dbData = await vm.updateInvoicesForDB(dates)

        vm.isLoading = false

        vm.$store.dispatch('updateInvoices', dbData)

      },
      /**
       * 支払データの取得
       *
       * @param searchFilterDates 支払データ取得APIの検索条件
       */
      async getPayments(searchFilterDates) {

        let vm = this

        vm.isLoading = true

        let dates = {}
        for (let i = 0; i < searchFilterDates.length; i++) {

          let searchFilterDate = searchFilterDates[i]

          let paymentsByMonth = await vm.getPaymentsByMonth(searchFilterDate)

          // 年月（yyyy-MM）をKEYとしてデータを保持
          dates[searchFilterDate.firstDate.substr(0, 7)] = paymentsByMonth

          vm.apiInfoPayments.push({
            from: searchFilterDate.firstDate,
            to: searchFilterDate.lastDate,
            cnt: paymentsByMonth.length
          })

          // API制限のためwait処理
          await api.wait(1000)

        }

        let dbData = await vm.updatePaymentsForDB(dates)

        vm.isLoading = false

        vm.$store.dispatch('updatePayments', dbData)

      },
      /**
       * 請求データAPI接続
       *
       * @param searchFilterDate 検索条件に指定する請求日のFromTo
       * @returns {Promise<void>}
       */
      async getInvoicesByMonth(searchFilterDate) {

        let opts = {
          invoice_date_gteq: searchFilterDate.firstDate,
          invoice_date_lteq: searchFilterDate.lastDate,
          per_page: 100,
          page: 1
        }

        let data = this.callApi('invoices', opts)
        return data

      },
      /**
       * 支払データAPI接続
       *
       * @param searchFilterDate 検索条件に指定する請求日のFromTo
       * @returns {Promise<void>}
       */
      async getPaymentsByMonth(searchFilterDate) {

        let opts = {
          invoice_date_gteq: searchFilterDate.firstDate,
          invoice_date_lteq: searchFilterDate.lastDate,
          per_page: 100,
          page: 1
        }

        let data = this.callApi('expenditure_payments', opts)
        return data

      },
      /**
       * API呼び出し
       *
       * @param urlPath URLパス
       * @param opts APIリクエストオプション
       * @returns {Promise<*>}
       */
      async callApi(urlPath, opts) {

        let res = await api.get(urlPath, opts)
        let body = res.data
        let data = body

        let isNext = true
        while (isNext) {

          if (res.headers.link && res.headers.link.indexOf('next') > -1) {

            await api.wait(1000)

            opts['page'] = opts['page'] + 1

            res = await api.get(urlPath, opts)
            body = res.data
            data = data.concat(body)

          } else {

            isNext = false

          }
        }

        return data

      },
      /**
       * Boardデータ読込
       *
       * @returns {Promise<void>}
       */
      async loadData() {

        const vm = this
        const searchFilterDates = vm.$store.getters.searchFilterDates

        // 請求データ
        await this.getInvoices(searchFilterDates)

        // 支払データ
        await this.getPayments(searchFilterDates)

      }

    }
  }
</script>

<style lang="scss">
</style>
