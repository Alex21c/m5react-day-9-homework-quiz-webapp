import { useState } from 'react';
import './App.css';
import './Assests/fontAwesomeProIcons/fontAwesomeIcons.css';
import { useEffect } from 'react';
import SuccessAndErrorMsg from './Components/SuccessAndErrorMsg';
import QuestionDialog from './Components/QuestionDialog';

function App() {

  function beginCountdown(){
    console.log(stateQuizWebApp.countdownProhibitedToRun, stateQuizWebApp.questions.length);
    if(stateQuizWebApp.countdownProhibitedToRun){
      console.log('returning from beginCoutdown!');
      return;
    }
    let intervalId;
    intervalId = setInterval(()=>{
      // decrease the timeout 
        updateStateTimeLeft(previousState=>{
          return previousState-1000
        });
    }, 1000);


    setTimeout(() => {      
      // clearing the interval       
      clearInterval(intervalId);      
      // now i want to switch to next question
        updateStateQuizWebApp(previousState=>{
          return {
            ...previousState,
            currentQuestionNo: previousState.currentQuestionNo+1,
            countdownProhibitedToRun : (previousState.currentQuestionNo+1 >= previousState.questions.length) ? true : false
          }
        });
      // re-initialize
       updateStateTimeLeft(stateQuizWebApp.timeout);
      // and begin countdown
      if(!stateQuizWebApp.countdownProhibitedToRun){
        beginCountdown();
      }

    }, stateQuizWebApp.timeout)
  }
  function skipQuestion(){
    // update currentquestion no      
    // record user response as nothing or accordingly    
    updateStateQuizWebApp(previousState=>{
      return {
        ...previousState,
        currentQuestionNo: previousState.currentQuestionNo+1,
        countdownProhibitedToRun : previousState.currentQuestionNo+1 >= previousState.questions.length ? true : false
      }
    });

  }
  
  async function makeAPICall(){
    try {
      let response = await fetch(stateQuizWebApp.apiURL);
      let result = await response.json();
      // console.log(result.results);
      // update the state with the fetched data
      result = [...result.results];

      updateStateQuizWebApp(previousState=>{
        return {
          ...previousState,
          questions: [...result]
        }
      });
    } catch (error) {
      updateStateQuizWebApp(previousState=>{
        return {
          ...previousState,
          countdownProhibitedToRun: true,
          SuccessAndErrorMsg:{
            ...previousState.SuccessAndErrorMsg,            
            msgType:"Error",
            msg: `Failed to fetch questions from API. ${error}`,
            displayNone: ''  
          }
        }
      });
      // console.log("ERROR: Failed to fetch questions from API." + error);
    } finally{
      beginCountdown();
    }
  }
  function returnInitialState(){
    return {
      apiURL : "https://opentdb.com/api.php?category=18&amount=10&difficulty=easy&type=multiple",
      timeout: 2000, // seconds
      countdownProhibitedToRun: false,
      intervalID: null,
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

  useEffect(()=>{
    // console.log(stateQuizWebApp.apiURL);
    // making an API Call
    console.log('making api call');
    makeAPICall();
    

  }, []);



    
    return (      
      <div className="wrapperLocalTaskerApp border-2 border-slate-200 p-[2rem] w-[50rem] mt-[2rem] m-auto rounded-md flex flex-col gap-[2rem] text-[1.2rem] text-slate-200">        
        <h1 className='text-blue-300 text-[2.5rem] font-semibold smallCaps flex flex-col gap-[0rem]  text-center'><span>Quiz WebApp</span> <span className='text-[1.5rem]'>( <a href="https://geekster.in/" className='underline hover:text-yellow-300 transition'>Geekster</a> Module#5 React Day #9 Homework :)</span></h1>
        <SuccessAndErrorMsg  stateSuccessAndErrorMsg={stateQuizWebApp.SuccessAndErrorMsg}/>
        {
        stateQuizWebApp.currentQuestionNo <=10 ? 
        <QuestionDialog 
          currentQuestionNo={stateQuizWebApp.currentQuestionNo} 
          question={stateQuizWebApp.questions[stateQuizWebApp.currentQuestionNo-1]}
        />
        : 
        // Result Card
          <div>

          </div>
        }
        {/* Time Left */}
        {
          <div>
            <span>Time Left: </span>
            <span>{stateTimeLeft/1000} Seconds</span>
          </div>          
        }
    

        <button onClick={skipQuestion} className="font-semibold flex gap-[1rem] items-center justify-center outline outline-2 outline-amber-50 bg-yellow-300 hover:bg-yellow-500 transition cursor-pointer p-[1rem] rounded-md hover:text-slate-50 text-slate-900 text-[1.5rem]" type="submit">
          <i className="fa-solid fa-forward"></i>
          <span>Skip Question</span>
          </button>
      </div>
  
    );

}

export default App;
