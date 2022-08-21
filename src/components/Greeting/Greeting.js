import React, { useState, useEffect } from 'react'
import { Panel } from 'rsuite';
import { getTimeOfDay } from '../../utils/dateHelpers';
import { RiDoubleQuotesL } from 'react-icons/ri'
import quotes from '../../data/quotes.json';
import Morning from '../../svg/Morning';
import Afternoon from '../../svg/Afternoon';
import Evening from '../../svg/Evening';
import Night from '../../svg/Night';
import './Greeting.css';

export default function Greeting({ loginInfo }) {
  const { timeOfDay, timeOfDayText, emoji } = getTimeOfDay();
  const [quote, setQuote] = useState('');

  useEffect(()=>{
    let chosenQuote = quotes['quotes'][Math.floor(Math.random() * quotes['quotes'].length)];
    setQuote(chosenQuote);
  }, [])

  return (
    <Panel bordered className="greeting-panel">
        <div className="greeting-container">
            <div className="greeting-content">
                <h2>{timeOfDayText}, {loginInfo.username}</h2>
                <div className="quote">
                    <RiDoubleQuotesL className="quote-icon"/>
                    <br />
                    {quote.quote}
                    <br />
                    <strong>{quote.author}</strong>
                </div>
            </div>
            <div className="greeting-svg">
                { timeOfDay === 'morning' && <Morning /> }
                { timeOfDay === 'afternoon' && <Afternoon /> }
                { timeOfDay === 'evening' && <Evening /> }
                { timeOfDay === 'night' && <Night /> }
            </div>
        </div>
    </Panel>
  )
}
