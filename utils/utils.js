export const username = (address) => {
  let temp1 = address.substring(0, 5)
  let temp2 = address.substring(address.length - 3)
  return temp1 + '...' + temp2
}

export const goalPercentage = (numerator, denominator) => {
  return parseInt((numerator * 100) / denominator)
}

export const findById = (data, id) => {
  let filteredData = data.filter((item) => item.eventId == id)
  return filteredData
}

export const filterContributorsByEvent = (data) => {
  let filteredResult = data.reduce(function (r, a) {
    r[a.eventId] = r[a.eventId] || []
    r[a.eventId].push(a)
    return r
  }, Object.create(null))

  let obj = Object.entries(filteredResult)[0][1]
  let obj2 = filterContributorsByHash(obj)

  return obj2
}

export const filterContributorsByHash = (data) => {
  let filteredResult = data.reduce(function (r, a) {
    r[a.contributor] = r[a.contributor] || []
    r[a.contributor].push(a)
    return r
  }, Object.create(null))
  return Object.entries(filteredResult)
}
