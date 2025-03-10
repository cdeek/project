import React from 'react'

import './style.css'

export const LoadingShimmer: React.FC<{
  number?: number
  height?: number // in `base` units
}> = props => {
  const arrayFromNumber = Array.from(Array(props.number || 1).keys())

  return (
    <div className="loading">
      {arrayFromNumber.map((_, index) => (
        <div key={index} className="shimmer" />
      ))}
    </div>
  )
}

