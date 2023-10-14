import { gql } from '@apollo/client'

// GraphQL query to get a judge by UID
export const JUDGE = gql`
  query Judge($uid: String!) {
    judge(uid: $uid) {
      uid
      email
      name
      surname
      accepted
    }
  }
`

// GraphQL query to get all judges
export const JUDGES = gql`
  query Judges {
    judges {
      uid
      email
      name
      surname
      accepted
    }
  }
`

// GraphQL mutation to post a new judge
export const POST_JUDGE = gql`
  mutation PostJudge($input: JudgeInput!) {
    postJudge(input: $input) {
      uid
      email
      name
      surname
      accepted
    }
  }
`
