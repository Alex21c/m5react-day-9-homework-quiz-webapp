import './App.css';
import './Assests/fontAwesomeProIcons/fontAwesomeIcons.css';
import { useEffect, useReducer, useState } from 'react';
import SuccessAndErrorMsg from './Components/SuccessAndErrorMsg';
import QuestionDialog from './Components/QuestionDialog';


function App() {
  function reducer(state, action){
    if(action.type === 'clearInterval'){
      // console.log(state);
      clearTimeout(state.timeoutId);
      clearInterval(state.intervalId);
      return {
        intervalId : null,
        timeoutId : null
      }
    }else if(action.type === 'setIntervalId'){
      return {
        ...state, 
        intervalId:  action.intervalId
      };
    }else if(action.type === 'setTimeoutId'){
      return {
        ...state, 
        timeoutId:  action.timeoutId
      };
    }else{
      return {...state};
    }
  }
   
  let [stateIntervalId, dispatch] = useReducer(reducer, null);
  let currentQuestionNo = 1;
  function beginCountdown(){
    if(stateQuizWebApp.countdownProhibitedToRun){
      //console.log('returning from beginCoutdown!');
      return;
    }
    
   
    askQuestions();
    function askQuestions(){
      let intervalId = (
          setInterval(()=>{
          // decrease the timeout 
            updateStateTimeLeft(previousState=>{
              return previousState-1000
            });
        }, 1000)
      );
      dispatch({type: 'setIntervalId', intervalId : intervalId});
      
      
  
      let timeoutId = setTimeout(() => {      
        // clearing the interval       
          dispatch({type: 'clearInterval'});

        // do not execute this codeblock, if user have pressed button skip Question or have clicked on any answer
        // so i'm using clearTimeout for this
        // now i want to switch to next question

        currentQuestionNo++;
          
          if(currentQuestionNo <=10){
            // keep asking questions
              updateStateQuizWebApp(previousState=>{
                // //console.log(`${previousState.currentQuestionNo+1} >= 10`, (previousState.currentQuestionNo+1 >= 10) ? true : false)
                return {
                  ...previousState,
                  currentQuestionNo: previousState.currentQuestionNo +1,
                  countdownProhibitedToRun : previousState.currentQuestionNo+1 > previousState.questions.length ? true : false
                }
              });            
              updateStateTimeLeft(stateQuizWebApp.timeout);
              askQuestions();

          }else{
            console.log('marking flag true allQuestionsAsked!');
            updateStateQuizWebApp(previousState=>{
              return {
                ...previousState,
                allQuestionsAsked: true
              }

            });
          }
  
  
      }, stateQuizWebApp.timeout);

      dispatch({type: 'setTimeoutId', timeoutId : timeoutId});

    }
  }
  function skipQuestion(){
    // update currentquestion no      
    // record user response as nothing or accordingly    
    dispatch({type: 'clearInterval'});
    updateStateQuizWebApp(previousState=>{
      return {
        ...previousState,
        allQuestionsAsked: previousState.currentQuestionNo+1 >= previousState.questions.length ? true : false,
        currentQuestionNo: previousState.currentQuestionNo+1,
        countdownProhibitedToRun : previousState.currentQuestionNo>= previousState.questions.length ? true : false,
      }
    });
    updateStateTimeLeft(stateQuizWebApp.timeout);
    beginCountdown();

  }
  
  async function makeAPICall(){
    try {
      let response = await fetch(stateQuizWebApp.apiURL);
      let result = await response.json();
      // //console.log(result.results);
      // update the state with the fetched data
      result = [...result.results];

      updateStateQuizWebApp(previousState=>{
        return {
          ...previousState,
          questions: [...result]
        }
      });
      beginCountdown();

    } catch (error) {
      updateStateQuizWebApp(previousState=>{
        return {
          ...previousState,
          countdownProhibitedToRun: true,   
          criticalErrorOccurred: true,       
          SuccessAndErrorMsg:{
            ...previousState.SuccessAndErrorMsg,            
            msgType:"Error",
            msg: `Please try again after some time, Failed to fetch questions from API. ${error}`,
            displayNone: ''  
          }
        }
      });
      // //console.log("ERROR: Failed to fetch questions from API." + error);
    }
  }
  function handleUserAnswers(userAnsweredCorrectly){
    //console.log('inside', userAnsweredCorrectly);

    // now i want to update the no of correct answers users had made
    // and also want to ask next question
    dispatch({type: 'clearInterval'});
    // alert(intervalId);
    updateStateTimeLeft(stateQuizWebApp.timeout);

    updateStateQuizWebApp(previousState=>{
      return {
        ...previousState,
        currentQuestionNo: previousState.currentQuestionNo+1,
        allQuestionsAsked: previousState.currentQuestionNo >= previousState.questions.length ? true : false,
        userResponse : {
          ...previousState.userResponse,
          correctAnswers: userAnsweredCorrectly ? previousState.userResponse.correctAnswers + 1 : previousState.userResponse.correctAnswers
        }
      }
    });  

    beginCountdown();
  }



  function returnInitialState(){
    return {
      apiURL : "https://opentdb.com/api.php?category=18&amount=10&difficulty=easy&type=multiple",
      timeout: 7000, // seconds
      countdownProhibitedToRun: false,
      criticalErrorOccurred: false,
      allQuestionsAsked : false,
      intervalID: null,
      userResponse: {
        correctAnswers: 0
      },
      questions : [{
          "type": "multiple",
          "difficulty": "easy",
          "category": "Science: Computers",
          "question": "",
          "correct_answer": "",
          "incorrect_answers": [

          ]
                
      }],
      currentQuestionNo : 1,
      userAnswers: [],
      SuccessAndErrorMsg : {
        style: {
          Success: "text-green-300 text-[1.5rem]",
          Error: "text-red-300 text-[1.5rem]"
        },
        msgType: "Success",
        msg: "",
        displayNone: 'displayNone'        
      }
    };
  }
  let [stateQuizWebApp, updateStateQuizWebApp] = useState(returnInitialState());
  let [stateTimeLeft, updateStateTimeLeft] = useState(stateQuizWebApp.timeout);
  // useEffect(()=>{
  //   //console.log(stateQuizWebApp);
  // }, [stateQuizWebApp]);

  useEffect(()=>{
    // //console.log(stateQuizWebApp.apiURL);
    // making an API Call
    //console.log('making api call');
    makeAPICall();
    

  }, []);




    
    return (      
      <div className="wrapperQuizWebApp border-2 border-slate-200 p-[2rem] w-[50rem] mt-[2rem] m-auto rounded-md flex flex-col gap-[2rem] text-[1.2rem] text-slate-200">        
        <h1 className='text-blue-300 text-[2.5rem] font-semibold smallCaps flex flex-col gap-[0rem]  text-center'><span>Quiz WebApp</span> <span className='text-[1.5rem]'>( <a href="https://geekster.in/" className='underline hover:text-yellow-300 transition'>Geekster</a> Module#5 React Day #9 Homework :)</span></h1>
        <SuccessAndErrorMsg  stateSuccessAndErrorMsg={stateQuizWebApp.SuccessAndErrorMsg}/>
        {
        stateQuizWebApp.currentQuestionNo <= stateQuizWebApp.questions.length && !stateQuizWebApp.allQuestionsAsked && !stateQuizWebApp.criticalErrorOccurred && 
        <QuestionDialog 
          currentQuestionNo={stateQuizWebApp.currentQuestionNo} 
          question={stateQuizWebApp.questions[stateQuizWebApp.currentQuestionNo-1]}
          handleUserAnswers= {handleUserAnswers}
        />
        }

        {
          stateQuizWebApp.allQuestionsAsked  ?
          <div>
            <h2 className='text-[1.8rem] font-semibold'>Quiz Ended</h2>
            <p>
              Your Score: {Number(stateQuizWebApp.userResponse.correctAnswers)}/{stateQuizWebApp.questions.length}
            </p>
          </div>
        
            :
          
              
              !stateQuizWebApp.countdownProhibitedToRun &&
              <div>
                <div className='flex gap-[1rem] items-center'>
                  <span className='flex gap-[.5rem] items-center'>
                    <i className="fa-solid fa-hourglass-half text-[2rem] text-blue-300"></i>
                    <span>Time Left:</span>
                  </span>
                  <span>{stateTimeLeft/1000} Seconds</span>
                </div>   
                
                <button onClick={skipQuestion} className="font-semibold flex gap-[1rem] items-center justify-center outline outline-2 outline-amber-50 bg-yellow-300 hover:bg-yellow-500 transition cursor-pointer mt-[1rem] py-[.5rem] p-[1rem] rounded-md hover:text-slate-50 text-slate-900 text-[1.5rem] select-none" type="submit">
                <i className="fa-solid fa-forward"></i>
                <span>Skip Question</span>
                </button>
            </div>
          
       
              


        }
    

      </div>
  
    );

}

export default App;
