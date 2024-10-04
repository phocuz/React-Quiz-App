import React from 'react';
import { useQuiz } from '../context/QuizContext'; 

function Option({ question }) {
  const { dispatch, answer } = useQuiz(); 

  const hasAnswer = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${answer === index ? 'answer' : ''} ${
            hasAnswer ? index === question.correctOption ? "correct" : "wrong" : ""
          }`} 
          key={option} 
          disabled={hasAnswer}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Option;