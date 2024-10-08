import React from 'react'
import { useQuiz } from '../context/QuizContext';

function Finished() {
  const {points,maxPoints,highscore,dispatch} = useQuiz();
    const percentage = (points/maxPoints)*100;
    let emoji;
    if (percentage===100) emoji ="🥇💰";
    if (percentage >=80 && percentage < 100) emoji ="🥈";
    if (percentage === 0) emoji ="🙈";
  return (
    <>
    <div className='result'>
      <p>{emoji} you score <strong>{points}</strong> out the maximum {maxPoints} ({Math.ceil(percentage)}%)</p>
    </div>
    <p className="highscore">(Highest Score: {highscore} point 🎉)</p>
    
     <button className='btn btn-ui' onClick={()=> dispatch({type:"restart"})}>Restart</button></>
  )
}

export default Finished
