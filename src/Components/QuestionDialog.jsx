import he from 'he'; // Import the he library for decoding html entities like single quotes as fetched from api
import { useRef } from 'react';


export default function QuestionDialog({currentQuestionNo, question, handleUserAnswers}){
  let radioRefs = useRef([]);

  function resetCheckboxState() {
    // Loop through each radio input and reset its checked property
    radioRefs.current.forEach(radio => {
      radio.checked = false;
    });
  
  }

  function doesUserAnsweredCorrectly(event){
    let userAnswer = event.target.value;
    event.target.checked = true;
    // //console.log(question.incorrect_answers, question.incorrect_answers.includes(userAnswer));
    let userAnsweredCorrectly = false;
    if(!question.incorrect_answers.includes(userAnswer)){
      // that means user has answered the question correctly
        userAnsweredCorrectly = true;
    }
    // //console.log(userAnswer);
    // handleUserAnswers
    
    setTimeout(()=>{
      resetCheckboxState();
      handleUserAnswers(userAnsweredCorrectly);
    }, 200);
    

  }

  // //console.log(question);
  let options = [...question.incorrect_answers, question.correct_answer];
  return (
    <section className='flex flex-col gap-[.5rem]'>
      <h2 className='text-[1.8rem] font-semibold'>Question #{currentQuestionNo}</h2>
      <h3 className='text-[1.5rem] font-semibold'>{he.decode(question.question)}</h3>
      <fieldset className='flex flex-col gap-[1rem]' onChange={doesUserAnsweredCorrectly}>
        {
          options.map((option, key)=>{
          return (
            <div key={key} className='flex gap-[0.5rem]'>
              <input  
              ref = {(el)=> radioRefs.current[key] = el}
              className='w-[3rem] 3-[5rem]' type="radio" name='question' id={he.decode(option)} value={he.decode(option)} />
              <label htmlFor={he.decode(option)}>{he.decode(option)}</label>
            </div>
          )      
        })
        }
      </fieldset>


    </section>
    

  );
}