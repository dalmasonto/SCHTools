import React from 'react'

const Banner = ({ title, tagline }) => {
  return (
    <div className='custom-banner'>
      <div className='container py-5 text-center'>
        <h1>{title}</h1>
        <p>{tagline}</p>
      </div>
    </div>
  )
}

export default Banner