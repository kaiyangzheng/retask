import React from 'react'
import { 
    Breadcrumb
} from 'rsuite';
import {
    capitalizeFirstLetter
} from './../../utils/stringHelpers';
import './Breadcrumb.css';

export default function BreadcrumbHeader({ location }) {
  let pathArray = location.pathname.split('/').splice(1, location.pathname.split('/').length)
  return (
    <Breadcrumb>
        {pathArray.map((link, index)=>{
            return <Breadcrumb.Item key={index} href={`/${link}`} className="breadcrumb-item" active={index+1 == pathArray.length}>{capitalizeFirstLetter(link)}</Breadcrumb.Item>
        })}
    </Breadcrumb>
  )
}
