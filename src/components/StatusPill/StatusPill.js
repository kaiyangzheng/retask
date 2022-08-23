import React from 'react'
import './StatusPill.css';

export default function StatusPill({ type, text }) {
  if (type === 'danger'){
    return <span className="c-pill c-pill--danger">{text}</span>
  } else if (type === 'success'){
    return <span className="c-pill c-pill--success">{text}</span>
  } else if (type === 'warning'){
    return <span className="c-pill c-pill--warning">{text}</span>
  } else if (type === 'progress'){
    return <span className="c-pill c-pill--progress">{text}</span>
  }
}
