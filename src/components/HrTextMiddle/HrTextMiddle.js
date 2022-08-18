import './HrTextMiddle.css';

import React from 'react'

export default function HrTextMiddle({text}) {
  return (
    <div className="strike">
        <span>{text}</span>
    </div>
  )
}
