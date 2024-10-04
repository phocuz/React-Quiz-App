import { createContext, useContext } from "react";
import { useEffect, useReducer } from "react";

const QuizContext = createContext();

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

function QuizProvider({children}){

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
        <QuizContext.Provider value={{
            questions,
            numQuestions,
            status,
            maxPoints,
            index,
            answer,
            points,
            highscore,
            secondsRemaining,
            dispatch,
    }}>
        {children}
    </QuizContext.Provider>
    )
}

function useQuiz() {
    const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}

export {useQuiz,QuizProvider};