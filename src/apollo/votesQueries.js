import { gql } from '@apollo/client'

export const VOTES_FOR_SAMPLE = gql`
  query VotesForSample($round: String!, $step: String!, $sample: String!, $uid: String!) {
    votesForSample(round: $round, step: $step, sample: $sample, uid: $uid) {
      id
      uid
      email
      round
      roundTitle
      step
      sampleId
      sample
      questionId
      question
      score
      answer
    }
  }
`

export const ALL_VOTES_FOR_ROUND = gql`
  query AllVotesForRound($round: String!) {
    allVotesForRound(round: $round) {
      id
      uid
      email
      round
      roundTitle
      step
      sampleId
      sample
      questionId
      question
      score
      answer
    }
  }
`

export const POST_VOTES = gql`
  mutation PostVotes($votes: [VoteInput]!) {
    postVotes(votes: $votes) {
      success
      error
    }
  }
`
