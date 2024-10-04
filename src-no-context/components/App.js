import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import Finished from "./Finished";
import Footer from "./Footer";
import Timer from "./Timer";

const SECS_PER_QUESTION=30;
const initialState = {
  questions: [],
  //'loading','error','ready','active','finished'
  status: "loading",
  index: 0,
  answer:null,
  points:0,
  highscore :0,
  secondsRemaining: null,
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
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
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
          case "finishedBtn":
            return {
              ...state,
              status : "finished",
              highscore: state.points > state.highscore? state.points : state.highscore,
            };
            case "restart":
              return{
                ...initialState,
                questions: state.questions,
                 status:"ready",
                // ...state,
                // index: 0,
                // answer:null,
                // points:0,
                // highscore :0

              };
              case "tick":
                return{
                  ...state,
                  secondsRemaining:  state.secondsRemaining -1,
                  status: state.secondsRemaining ===0 ? state="finished":state.status
                }
    default:
      throw new Error("Unknown action type");
  }
}

function App() {
  const [{ questions, status, index,answer,points,highscore,secondsRemaining }, dispatch] = useReducer(reducer, initialState); // Destructuring state

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

          <Footer>
            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />

            <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions}/>
          </Footer>
        </>
         } 
         {status==="finished" && <Finished points={points} maxPoints={maxPoints} dispatch={dispatch} highscore={highscore} />}
      </Main>
    </div>
  );
}

export default App;
