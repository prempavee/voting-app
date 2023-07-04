import { $host } from "./index"

export const postJudge = async (token, uid, email, name, surname) => {
  const postData = { uid, email, name, surname }
  const url = '/postJudge'
  const { data } = await $host.post(url, postData, { headers: { authorization: `Bearer ${token}` }})
  return data
}

export const getJudgeByUid = async (token, uid) => {
  const url = `/getJudgeByUid?uid=${uid}`
  const { data } = await $host.get(url, { headers: { authorization: `Bearer ${token}` }})
  return data
}

export const getAllJudges = async (token) => {
  const url = '/getAllJudges'
  const { data } = await $host.get(url, { headers: { authorization: `Bearer ${token}` }})
  return data
}
