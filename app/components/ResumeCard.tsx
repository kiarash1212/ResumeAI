import { useEffect } from "react";
import { Link } from "react-router"
import ScoreCircle from "~/components/ScoreCircle";
import { usePuterStore } from "~/../lib/puter";
import { useState } from "react";
const ResumeCard = ({resume} : {resume: Resume}) => {
  const {fs} = usePuterStore();
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    const getImage = async () => {
    const imageBlob = await fs.read(resume.imagePath);
    if (!imageBlob) return;
    const imageUrl = URL.createObjectURL(imageBlob);
    setImageUrl(imageUrl);}
    getImage();
  })

  return (
    <Link to={`/resume/${resume.id}`} className="resume-card animate_in fade-in duration-1000">

        <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col gap-2">

        <h2 className="!text-black font-bold break-words">{resume.companyName}</h2>
        <h3 className="text-lg break-words text-gray-500">{resume.jobTitle}</h3>

        </div>
    
        <div className="flex-shrink-0">
        <ScoreCircle score={resume.feedback.overallScore} />
        </div>

        </div>

        <div className="gradient-border animate-in fade-in duration-1000">

            <div className="w-full h-full">
                <img 
                src={imageUrl}
                alt={resume.companyName}
                className="w-full h-[350px] max-sm:h-[200px] object-cover object-top-left"
                />
            </div>

        </div>
        
    </Link>
  )
}

export default ResumeCard