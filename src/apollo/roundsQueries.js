import { gql } from '@apollo/client'

export const ROUNDS = gql`
  query {
    rounds {
      id
      title
      start
      samplesNumber
      current
    }
  }
`

export const CURRENT_ROUND = gql`
  query {
    currentRound {
      id
      title
      start
      samplesNumber
    }
  }
`

export const POST_ROUND = gql`
  mutation PostRound($input: RoundInput!) {
    postRound(input: $input) {
      title
      start
      samplesNumber
    }
  }
`

export const MAKE_ROUND_CURRENT = gql`
  mutation MakeRoundCurrent($id: Int!) {
    makeRoundCurrent(id: $id) {
      id
    }
  }
`
