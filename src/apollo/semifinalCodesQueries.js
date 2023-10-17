import { gql } from '@apollo/client'

export const SEMIFINAL_CODE = gql`
  query SemifinalCode($code: String!) {
    semifinalCode(code: $code) {
      code
      used
    }
  }
`
export const USE_SEMIFINAL_CODE = gql`
  mutation UseSemifinalCode($code: String!) {
    useSemifinalCode(code: $code) {
      code
      used
    }
  }
`
