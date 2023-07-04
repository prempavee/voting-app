import { $host } from "./index"

export const postVotes = async (token, votes) => {
  const postData = { votes }
  const url = '/postVotes'
  const result = await $host.post(url, postData, { headers: { authorization: `Bearer ${token}` }})
  return result
}

export const getVotesForSample = async (token, uid, round, step, sample) => {
  const url = `/getVotesForSample?uid=${uid}&round=${round}&step=${step}&sample=${sample}`
  const result = await $host.get(url, { headers: { authorization: `Bearer ${token}` }})
  return result
}

export const getAllVotesForRound = async (token, round) => {
  const url = `/getAllVotesForRound?&round=${round}`
  const result = await $host.get(url, { headers: { authorization: `Bearer ${token}` }})
  return result
}
