import React, { useEffect } from 'react'
import { useQuiz } from '../context/QuizContext';

function Timer() {

  const {dispatch,secondsRemaining} = useQuiz();

    const mins = Math.floor(secondsRemaining/60);

    const seconds = secondsRemaining % 60;
    useEffect(()=>{

        const id = setInterval(() => {
           dispatch({type:"tick"})
        }, 1000);

            return ()=> clearInterval(id);
    },[dispatch])

  return (
    <div className='timer'>
      {mins}:{seconds}
    </div>
  )
}

export default Timer
