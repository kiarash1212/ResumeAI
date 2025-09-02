import React from 'react'
import ScoreGuage from './ScoreGuage'


const VarList = ({name, score} : any) => {
    const scoreColor = score > 50 ? 'text-green-400' : 'text-red-400'
    return (

        <div className='resume-summary'>
            <div className='category'>
                
                <p className='text-sm text-gray-400'>{name}</p>
                <p className='text-sm text-gray-400'><span className={scoreColor}>{score}</span>/100</p>
                
            </div>
        </div>
    )
}
function Summary({feedback}: {feedback: Feedback}) {
  return (
    <div className='bg-white rounded-2xl shadow-md w-full'>
        <div className='flex flex-row items-center p-4 gap-8'>
            <ScoreGuage score={feedback.overallScore} />

            <div className='flex flex-col gap-2'>
                <h2 className='text-2xl font-bold text-white'>Your Resume Score</h2>
                <p className='text-sm text-gray-400'>the score is calculated based on these variables list below.</p>
            </div>
            
        </div>

        
        <VarList name='Tone and Style' score={feedback.toneAndStyle.score} />
        <VarList name='Content' score={feedback.content.score} />
        <VarList name='Structure' score={feedback.structure.score} />
        
    </div>
  )
}

export default Summary