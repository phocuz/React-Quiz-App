import React from 'react'
import Option from './Option'
import { useQuiz } from '../context/QuizContext'

function Question() {
  const { questions, index } = useQuiz();
  const currentQuestion = questions[index];
         
  return (
    <div>
      <h4>{currentQuestion.question}</h4>
      <Option question={currentQuestion} />
    </div>
  )
}

export default Question
