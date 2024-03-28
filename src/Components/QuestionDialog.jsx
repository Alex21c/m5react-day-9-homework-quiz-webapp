import he from 'he'; // Import the he library for decoding html entities like single quotes as fetched from api

export default function QuestionDialog({currentQuestionNo, question}){
  console.log(question);
  let options = [...question.incorrect_answers, question.correct_answer];
  return (
    <section className='flex flex-col gap-[.5rem]'>
      <h2 className='text-[1.8rem] font-semibold'>Question #{currentQuestionNo}</h2>
      <h3 className='text-[1.5rem] font-semibold'>{he.decode(question.question)}</h3>
      <fieldset className='flex flex-col gap-[1rem]'>
        {
          options.map((option, key)=>{
          return (
            <div key={key} className='flex gap-[0.5rem]'>
              <input className='w-[3rem] 3-[5rem]' type="radio" name='question' id={he.decode(option)} value={he.decode(option)} />
              <label htmlFor={he.decode(option)}>{he.decode(option)}</label>
            </div>
          )      
        })
        }
      </fieldset>


    </section>
    

  );
}