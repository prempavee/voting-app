export default function generateAlphabeticalLetters(count) {
  const letters = []
  let currentCharCode = 'A'.charCodeAt(0)

  for (let i = 0; i < count; i++) {
    letters.push(String.fromCharCode(currentCharCode))
    currentCharCode++
  }

  return letters
}
