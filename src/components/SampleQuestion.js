import TextareaAutosize from 'react-textarea-autosize'

const SampleQuestion = ({ item, handleChangeAnswer }) => {
  return (
     <div className='flex flex-col'>
      <div className='flex-1 flex flex-col'>
        <p className='text-base'>{item.text}</p>
        <p className='text-sm text-gray-400 italic'>{item.comment}</p>
      </div>
      <TextareaAutosize
        id={`score${item.id}`}
        name={`score${item.id}`}
        value={item.answer}
        minRows={5}
        onChange={(e) => handleChangeAnswer(e.target.value, item.id)}
        className='m-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
      />
    </div>
  )
}

export default SampleQuestion
