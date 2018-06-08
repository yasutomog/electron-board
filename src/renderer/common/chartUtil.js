import bigNumber from 'bignumber.js'

export function formatNumber(value) {
  const formatter = new Intl.NumberFormat('ja-JP')
  return formatter.format(value)
}

export function makeTooltipByAmountAndCount(tooltipItem, data) {
  let datasetIndex = tooltipItem.datasetIndex
  let index = tooltipItem.index

  let count = data.datasets[datasetIndex].count[index]
  let label = data.datasets[datasetIndex].label

  const formatter = new Intl.NumberFormat('ja-JP')
  let fm = formatter.format(tooltipItem.yLabel)
  return label + ': ' + fm + '円（' + count + '件）'
}

export function translateForChart(res, filterStatusName, statuses, okStatuses) {
  
  let alertRecords = []
  res.forEach(function(resObj) {

    let os = resObj[filterStatusName];

    // 受注ステータス毎に件数をカウント
    statuses.forEach(function(status) {
      if (status.value === os) {
        status.count = status.count + 1
        status.amount = bigNumber(status.amount).plus(Number(resObj.total)).plus(Number(resObj.tax))
      }
    })

    // OKステータス以外のレコードを格納
    if (okStatuses.indexOf(os) === -1) {
      alertRecords.push(resObj)
    }

  });

  let values = {}
  let counts = []
  let amounts = []
  statuses.forEach(function(status) {
    counts.push(status.count)
    amounts.push(status.amount)
  })

  values.counts = counts
  values.amounts = amounts
  values.alertRecords = alertRecords

  return values

}
