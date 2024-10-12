import { Lightbulb, Volume2Icon } from 'lucide-react'
import React from 'react'

function Questions({mockinterviewquestions,activeInterviewquestions}) {

  const textToSpeech=(text)=>{
     if("speechSynthesis" in window){
      const speech=new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
     }
     else{
      alert("Sorry your Browser not supported yet")
     }
  }
    
  return mockinterviewquestions&& (
   
    <div className="p-5 border rounded-lg">

        <div className="grid grid-cols-2 md:grid-col-3 lg:grid-cols-4 gap-5" >
            {mockinterviewquestions && mockinterviewquestions.map((question,index)=>{
              return ( <h2 className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeInterviewquestions===index && 'bg-red-400 text-white'}`}>Question #{index+1}</h2>)
            })}
           
        </div>
        <h2 className=" my-5 text-sm md:text-lg">{mockinterviewquestions[activeInterviewquestions]?.question}</h2>
        <Volume2Icon className="cursor-pointer" onClick={()=>textToSpeech(mockinterviewquestions[activeInterviewquestions]?.question)}/>
        <div className="border rounded-lg p-5 bg-blue-100 mt-20">
            <h2 className="flex gap-2 items-center text-primary">
            <Lightbulb/>
            <strong>Note:</strong>
            </h2>
            <h2 className="text-sm text-primary my-2">Click on Record Answer when you want to answer the question. At the end of interview we will give you the feedback along with correct answer for each of question and your answer to compare It.</h2>

        </div>
    </div>
  )
}

export default Questions