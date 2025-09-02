import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {formatBytes} from '../utils'

interface UploaderProps {
    onFileSelect: (file: File) => void
}
function UploaderArea({onFileSelect} : UploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const onDrop = useCallback((acceptedFiles: File[]) => {

    const file = acceptedFiles[0]
    onFileSelect?.(file)
    setFile(file)

  }, [onFileSelect])

  const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf']
    }
  })

  return (
    <div className='w-full gradient-border'>

    
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      
      <div className='space-y-4 cursor-pointer flex flex-col items-center justify-center'>
        
        {file ? (
            <div className='uploader-selected-file w-full' onClick={(e) => e.stopPropagation()}>
                <img src='/images/pdf.png' alt='pdf' className='size-10' />
                
            <div>
            <p className='text-gray-800'>{file.name}</p>
            <p className='text-gray-500'>{formatBytes(file.size)}</p>
            </div>
            
            <button className='p-2 cursor-pointer' onClick={(e) => setFile(null)}>
                <img src='/icons/cross.svg' alt='remove' className='w-4 h-4'/>
            </button>

            </div>
            
        ) : (
            <>
            <div className='w-16 h-16 flex items-center justify-center'>
            <img src='/icons/info.svg' alt='info' />
            </div>
            <p className='text-gray-500'>
                <span className='font-semibold'>Click to upload</span> or drag and drop your resume here.
            </p>   
            <p className='text-gray-500'>Pdf [max 20mb]</p>
            </>
        )}
      </div>
    </div>
      </div>
  )
}

export default UploaderArea