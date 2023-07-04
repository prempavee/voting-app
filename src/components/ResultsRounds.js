const ResultsRounds = ({ rounds, handleClickRound }) => {

  return (
    <div className='my-5'>
      <h2 className='text-xl my-5 font-bold text-center'>Rounds</h2>
      {rounds.length > 0
        ? (
          <ul className='flex flex-col'>
            {rounds.map(item => {
              return (
                <li
                  key={item.id}
                  className={
                    item.current
                      ? 'bg-green-300 px-3 py-1.5 my-1'
                      : 'bg-indigo-300 px-3 py-1.5 my-1'
                  }
                >
                  <button onClick={() => handleClickRound(item.id)} className='w-full'>
                    {item.title} / {item.start}
                  </button>
                </li>
              )
            })}
          </ul>
        )
        : (
          <p className='text-sm'>... no rounds yet</p>
        )
      }
    </div>
  )
}

export default ResultsRounds
