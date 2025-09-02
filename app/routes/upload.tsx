import { useState } from "react"
import Navbar from "~/components/Navbar";
import UploaderArea from "~/components/UploaderArea";
import { usePuterStore } from "~/../lib/puter";
import {convertPdfToImage} from "~/../lib/pdf2image";
import { createUUID } from "~/utils";
import { prepareInstructions } from "../../constants";
import { useNavigate } from 'react-router';

function upload() {
    const {auth, isLoading, fs, error, ai, kv} = usePuterStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<string | null>();
    const [file, setFile] = useState<File | null>(null);

    const navigate = useNavigate()
    const handleFileSelect = (file : File | null) => {
        setFile(file);
    }

    const handleAnalayze = async ({companyName, jobTitle, jobDescription} : {companyName: string, jobTitle: string, jobDescription: string}) => {
        setIsProcessing(true);
        setResult('Uploading the file ...');
        const uploadedFile = await fs.upload([file!]);

        if (!uploadedFile) return setResult('Error uploading the file.');

        setResult('Converting the file to Image ...');

        const convertedFile = await convertPdfToImage(file!);

        if (!convertedFile.file) return setResult('Error' + convertedFile.error);

        const uploadedImage = await fs.upload([convertedFile.file!]);

        if (!uploadedImage) return setResult('Error uploading the image.');

        setResult('Analyzing the file ...');

        const uuid = createUUID()
        const data = {
            id : uuid,
            resumePath : uploadedFile.path,
            imagePath : uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback : '',
        }

        await kv.set(`resume-${uuid}`, JSON.stringify(data));

        const feedback = await ai.feedback(uploadedFile.path, 
            prepareInstructions({jobTitle, jobDescription})
        )

        if (!feedback) return setResult('Error analyzing the file.');

        const feedbackText = typeof feedback.message.content === 'string' ?
         feedback.message.content : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);

        await kv.set(`resume-${uuid}`, JSON.stringify(data));

        setResult('Done.');

        navigate(`/resume/${uuid}`);

    }
    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (form) {
            const formData = new FormData(form);

            const companyName = formData.get('companyName') as string;
            const jobTitle = formData.get('jobTitle') as string;
            const jobDescription = formData.get('jobDescription') as string;

            if (!file) return;

            handleAnalayze({companyName, jobTitle, jobDescription});
        }
    }
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />

        <section className="main-section">
            <div className="page-heading mb-5">
                <h1>Smart feedback for your resume</h1>

                {isProcessing ? (
                    <>
                    <h2>{result}</h2>
                    <img src="/images/resume-scan.gif" alt="loading" className="w-full" />
                    </>
                ):(
                    <h2>Upload your resume to get smart feedback.</h2>
                )
                }

                {!isProcessing && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                        <div className="form-div">
                            <label htmlFor="companyName">Comapany Name</label>
                            <input type="text" name="companyName" id="companyName" placeholder="Company Name" />
                        </div>
                        <div className="form-div">
                            <label htmlFor="jobTitle">Job Title</label>
                            <input type="text" name="jobTitle" id="jobTitle" placeholder="Job Title" />
                        </div>
                        <div className="form-div">
                            <label htmlFor="jobDescription">Job Description</label>
                            <input type="text" name="jobDescription" id="jobDescription" placeholder="Job Description" />
                        </div>

                        <div className="form-div">
                            <label htmlFor="uploader">Uploader</label>
                            <UploaderArea onFileSelect={handleFileSelect} />
                        </div>

                        <button className="primary-button" type="submit">
                            Analayze My Resume
                        </button>
                    </form>
                )}
            </div>
        </section>
    </main>
  )
}

export default upload