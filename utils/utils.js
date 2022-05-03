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
