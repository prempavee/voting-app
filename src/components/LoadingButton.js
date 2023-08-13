const LoadingButton = ( { loadingButton } ) => {
  if (loadingButton) {
    return (
      <svg
        className='animate-spin-slow h-5 w-5 mr-3'
        viewBox='0 0 24 24' 
        fill='none' 
        xmlns='http://www.w3.org/2000/svg'
      >
        <g strokeWidth='0'></g>
        <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
        <g id='SVGRepo_iconCarrier'>
          <path
            d='M12 2.99988V5.99988M12 20.9999V17.9999M4.20577 16.4999L6.80385 14.9999M21 11.9999H18M16.5 19.7941L15 17.196M3 11.9999H6M7.5 4.20565L9 6.80373M7.5 19.7941L9 17.196M19.7942 16.4999L17.1962 14.9999M4.20577 7.49988L6.80385 8.99988' 
            stroke='#ffffff' 
            strokeWidth='2' 
            strokeLinecap='round' 
            strokeLinejoin='round'
          />
        </g>
      </svg>
    )
  } else {
    return <div className='animate-spin-slow h-5 w-5 mr-3'/>
  } 
}

export default LoadingButton
