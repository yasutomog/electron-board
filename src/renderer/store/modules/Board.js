const state = {
  apiConfig: {
    "Authorization": '',
    "x-api-key": ''
  },
  searchFilter: {
    dates: []
  },
  boardData: {
    keys: [],
    invoices: {},
    payments: {}
  }
}

const mutations = {

  INIT_SEARCH_FILTER_DATES (state) {

    let currentDate = new Date()
    let currentY = currentDate.getFullYear()
    let currentM = currentDate.getMonth()
    let filterDates = []
    let keys = []

    // 現在日付から1年分の年月（月初日と月末日）を作成
    for (let i = 0; i < 12; i++) {
      let firstM = currentM - i;
      let lastM = currentM + 1 -i;
      let firstDate = formatDate(new Date(currentY, firstM, 1))
      let lastDate = formatDate(new Date(currentY, lastM, 0))
      filterDates.push({
        firstDate: firstDate,
        lastDate: lastDate
      })
      keys.push(firstDate.substr(0, 7))
    }

    state.searchFilter.dates = filterDates
    state.boardData.keys = keys

  },

  UPDATE_API_CONFIG (state, apiConfig) {

    state.apiConfig = apiConfig

  },

  UPDATE_INVOICES (state, dbData) {

    state.boardData.invoices = dbData.dates

  },

  UPDATE_PAYMENTS (state, dbData) {

    state.boardData.payments = dbData.dates

  }

}

const actions = {
  
  initSearchFilterDates ({ commit }) {
    
    commit('INIT_SEARCH_FILTER_DATES')
    
  },
  
  updateApiConfig({ commit }, apiConfig) {

    commit('UPDATE_API_CONFIG', apiConfig)
    
  },

  updateInvoices({ commit }, dbData) {

    commit('UPDATE_INVOICES', dbData)

  },

  updatePayments({ commit }, dbData) {

    commit('UPDATE_PAYMENTS', dbData)

  }

  
}

const getters = {
  searchFilterDates: state => state.searchFilter.dates,
  apiConfig: state => state.apiConfig,
  boardInvoices: state => state.boardData.invoices,
  boardDataKeys: state => state.boardData.keys
}

export default {
  state,
  mutations,
  actions,
  getters
}

const formatDate = (targetDate) => {

  let y = targetDate.getFullYear()
  let m = targetDate.getMonth() + 1
  if (m < 10) {
    m = '0' + m
  }
  let d = targetDate.getDate()
  if (d < 10) {
    d = '0' + d
  }

  return y + '-' + m + '-' + d

}