import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";
import { usePuterStore } from "~/../lib/puter";
import { useNavigate } from "react-router";
import Summary from "~/components/Summary";
import Details from "~/components/Details";
import ATS from "~/components/ATS";

function resume() {
    const { id } = useParams();
    const {auth, isLoading, fs, kv} = usePuterStore();
    const navigateTo = useNavigate();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
        navigateTo("/auth?next=/resume/" + id);
    }
    }, [isLoading]);

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get('resume-' + id);

            if (!resume) return;

            const data:any = JSON.parse(resume);

            const resumeBlob = await fs.read(data.resumePath);
            if (!resumeBlob) return;
            const resumeUrl = URL.createObjectURL(resumeBlob);
            setResumeUrl(resumeUrl);

            const imageBlob = await fs.read(data.imagePath);
            if (!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);
            
            
            setFeedback(data.feedback);

        }

        loadResume();
    }, [id])

  return (
    <>
    <nav className="resume-nav">
        <Link to='/' className='back-button'>
            <img src='/images/back.svg' alt='back' className='size-10' />
            <span className="text-gray-800 text-sm font-semibold">Back to Home page</span>
        </Link>
    </nav>
        <div className="flex flex-row w-full max-lg:flex-col-reverse">
            <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover sticky top-0 items-center justify-center"    >
                {imageUrl && resumeUrl && (
                    
                    <div className="animate-in fade-in duration-1000 gradient-border max-w-xl:h-fit w-fit">

                        <img src={imageUrl} alt="resume" className="w-full h-full object-cover rounded-2xl" />

                    </div>
                )}
            </section>
            
            <section className="feedback-section">
                <h2 className="font-bold text-4xl !text-black">Resume Feedback</h2>
                {feedback ? (
                    <div className="flex flex-col gap-4">
                        <Summary feedback={feedback} />
                        <ATS score={feedback.overallScore} suggestions={feedback.ATS.tips} />
                        {/* 
                        <Details feedback={feedback} /> */}
                    </div>
                ): (
                    <img src='/images/resume-scan-2.gif' alt='loading' className='w-full' />
                )}
            </section>
        </div>
    </>
  )
}

export default resume