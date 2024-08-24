import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";

const initialState = {
  questions: [],
  //'loading','error','ready','active','finished'
  status: "loading",
  index: 0,
  answer:null,
  points:0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload, 
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
      };
      case "newAnswer":
        const question =state.questions.at(state.index);
        return{
          ...state,
          answer: action.payload,
          points: action.payload ===question.correctOption ?
          state.points + question.points : state.points,
        };
        case "nextButton":
          return{
            ...state,index: state.index + 1, answer:null,
          };
    default:
      throw new Error("Unknown action type");
  }
}

function App() {
  const [{ questions, status, index,answer,points }, dispatch] = useReducer(reducer, initialState); // Destructuring state

  useEffect(() => {
    fetch("http://localhost:3030/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev,cur)=> cur.points + prev,0);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" &&
        <>
        <Progress index={index} numQuestions={numQuestions} points={points} maxPoints={maxPoints} answer={answer}/> 
         <Question 
         question={questions[index]} 
         answer={answer} 
         dispatch={dispatch}  
         />

         <NextButton dispatch={dispatch} answer={answer}/>
        </>
         } 
      </Main>
    </div>
  );
}

export default App;
