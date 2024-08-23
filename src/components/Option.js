import React from 'react';

function Option({ question, dispatch, answer }) {

    const hasAnswer = answer !==null;
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${answer === index ? 'answer' : ''} ${ hasAnswer? index ===question.correctOption? "correct": "wrong":""}`} 
          key={index} 
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
