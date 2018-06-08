<template>
  <div id="app">
    <div class="columns is-gapless">
      <div class="column is-narrow is-2">
        <div>
          <aside class="menu">
            <p class="menu-label">
              Charts
            </p>
            <ul class="menu-list">
              <li><router-link to="/invoiceschart">請求データ</router-link></li>
            </ul>
            <p class="menu-label">
              データ取込
            </p>
            <ul class="menu-list">
              <li><router-link to="/dataload">API接続</router-link></li>
            </ul>
            <p class="menu-label">
              Board API
            </p>
            <ul class="menu-list">
              <li><router-link to="/boardapisettingpage">設定</router-link></li>
            </ul>
          </aside>
        </div>
      </div>
      <div class="column">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import db from './datastore'
  import { remote } from 'electron'
  export default {
    name: 'electron-board',
    created() {

      let vm = this
      
      // 検索条件に使用する日付データを作成
      vm.$store.dispatch('initSearchFilterDates')

      // DBからAPI接続情報を取得してStore管理
      db.find({
        name: 'board-api-setting'
      } , function (err, doc) {

        if (err) {
          remote.dialog.showErrorBox("ERROR", 'DBからのAPI接続情報取得に失敗')
        }

        if (doc.length > 0) {

          let settings = doc[0]
          vm.$store.dispatch('updateApiConfig', {
            "Authorization": settings.authorization,
            "x-api-key": settings.apiKey
          })

        }

      })

      db.find({
        name: 'board-invoices'
      } , function (err, doc) {

        if (doc.length > 0) {

          vm.$store.dispatch('updateInvoices', doc[0])

        }

      })


    },
    mounted() {
    }
  }
</script>

<style>
  /* CSS */
</style>
