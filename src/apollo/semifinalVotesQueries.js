import { gql } from '@apollo/client'

export const SEMIFINAL_VOTES = gql`
  query {
    semifinalVotes {
      email
      sample
      q1
      q2
      q3
    }
  }
`

export const POST_SEMIFINAL_VOTES = gql`
  mutation PostSemifinalVotes($input: SemifinalVoteInput!, $code: String!) {
    postSemifinalVotes(input: $input, code: $code) {
      success
      error
    }
  }
`
