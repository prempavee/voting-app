import { $host } from "./index"

export const postRound = async (token, title, start) => {
  const postData = { title, start }
  const url = `/postRound`
  const result = await $host.post(url, postData, { headers: { authorization: `Bearer ${token}` }})
  return result
}

export const getCurrentRound = async (token) => {
  const url = `/getCurrentRound`
  const { data } = await $host.get(url, { headers: { authorization: `Bearer ${token}` }})
  return data
}

export const getRounds = async (token) => {
  const url = `/getRounds`
  const { data } = await $host.get(url, { headers: { authorization: `Bearer ${token}` }})
  return data
}

export const makeRoundCurrent = async (token, newId) => {
  const postData = { newId }
  const url = `/makeRoundCurrent`
  const result = await $host.patch(url, postData, { headers: { authorization: `Bearer ${token}` }})
  return result
}
