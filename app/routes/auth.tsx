import { useNavigate, useLocation } from "react-router";
import { usePuterStore } from "../../lib/puter";
import { use, useEffect } from "react";
export function meta() {
  return [
    { title: "ResumeAI | Auth" },
    { name: "description", content: "Auth" },
  ];
}

function auth() {
const {isLoading, auth} = usePuterStore();
const location = useLocation();
const next = location.search.split("next=")[1];
const navigateTo = useNavigate();

useEffect(() => {
  if (auth.isAuthenticated) {
    navigateTo(next || "/");
  }
}, [auth.isAuthenticated, next]);

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col items-center gap-8 bg-white rounded-2xl p-10">
            <div className="flex flex-col items-center gap-4">

                <h1>Welcome</h1>
                <h2>Sign in to your account</h2>

            </div>

            <div>
                {isLoading ? (
                    <button className="auth-button animate-pulse">Loading...</button>
                ) : (
                    <>
                    {auth.isAuthenticated ? (
                        <button className="auth-button" onClick={auth.signOut}>Sign Out</button>
                    ) : (
                        <button className="auth-button" onClick={auth.signIn}>Sign In</button>
                    )}
                    </>
                )
                }
            </div>
            
        </section>
      </div>
    </main>
  )
}

export default auth