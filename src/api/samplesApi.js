import { $host } from "./index"

export const postSample = async (token, sample) => {
  const postData = { sample: sample }
  const url = `/postSample`
  const result = await $host.post(url, postData, { headers: { authorization: `Bearer ${token}` }})
  return result
}

export const getSamples = async (token) => {
  const url = `/getSamples`
  const { data } = await $host.get(url, { headers: { authorization: `Bearer ${token}` }})
  // console.log('get samples', data)
  return data
}
