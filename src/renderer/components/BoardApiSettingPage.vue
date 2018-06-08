<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Board API 設定
          </h1>
          <h2 class="subtitle">
            APIに必要なKEY情報を設定してください
          </h2>
        </div>
      </div>
    </section>
    <div style="padding: 1.5rem;">
      <section>
        <b-field label="Authorization">
          <b-input v-model="authorization"></b-input>
        </b-field>
        <b-field label="x-api-key">
          <b-input v-model="apiKey"></b-input>
        </b-field>
        <p class="control">
          <button class="button is-primary" @click="setKey">
            設定
          </button>
          <button class="button is-primary" @click="getKey">
            取得
          </button>
        </p>
      </section>
    </div>
  </div>
</template>

<script>
  import db from '../datastore'
  import * as api from '../common/api'
  export default {
    name: 'board-api-setting-page',
    data() {
      return {
        authorization: '',
        apiKey: ''
      }
    },
    created() {

      const vm = this
      const apiConfig = vm.$store.getters.apiConfig
      vm.authorization = apiConfig['Authorization']
      vm.apiKey = apiConfig['x-api-key']

    },
    methods: {

      setKey() {

        const vm = this

        db.update({
          name: 'board-api-setting'
        }, {
          name: 'board-api-setting',
          authorization: vm.authorization,
          apiKey: vm.apiKey
        }, {
          upsert: true
        }, function (err, numReplaced, upsert) {

          if (err === null) {

            vm.$toast.open({
              message: '保存しました'
            })

            vm.$store.dispatch('updateApiConfig', {
              "Authorization": vm.authorization,
              "x-api-key": vm.apiKey
            })

          } else {

            vm.$toast.open({
              message: '保存に失敗しました',
              type: 'is-danger'
            })

          }


        });

        api.get('invoices', {
          invoice_date_gteq: '2018-04-01',
          invoice_date_lteq: '2018-04-30',
          per_page: 100,
          page: 1
        }).then((res) => {
          console.log(res);
        })


      },
      getKey() {

        const vm = this

        db.find({
          name: 'board-api-setting'
        } , function (err, doc) {
          if (doc.length > 0) {
            let settings = doc[0]
            vm.authorization = settings.authorization
            vm.apiKey = settings.apiKey
          }
        });

      }

    }

  }
</script>

<style lang="scss">
</style>
