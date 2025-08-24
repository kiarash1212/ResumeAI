import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "../../lib/puter"; 

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeAI" },
    { name: "description", content: "Smart Resume Analyzer!" },
  ];
}

export default function Home() {

  const {isLoading, auth} = usePuterStore();
const navigateTo = useNavigate();

useEffect(() => {
  if (!auth.isAuthenticated) {
    navigateTo("/auth?next=/");
  }
}, [auth.isAuthenticated]);

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
    <Navbar />
    <section className="main-section">
      <div className="page-heading">
      <h1>Track Your Resume & Resume Ratings</h1>
      </div>
      <h2>Review Your Submissions</h2>
    </section>

  
  {resumes.length > 0 && (
    <div className="resumes-section mt-8">
      {resumes.map((resume) => (
        <ResumeCard resume={resume} key={resume.id} />
      ))}

    </div>
  )}
  </main>
}
