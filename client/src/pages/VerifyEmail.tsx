import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthService } from "../services/auth-service";

const VerifyEmail = () => {

    const { token } = useParams<{ token: string }>()
    const [isLoading, setIsLoading] = useState(false)
    const [isVerified, setIsVerified] = useState(false)

    useEffect(() => {
        if (token) {
            async function sendRequest() {
                setIsLoading(true)
                try {
                    const res = await AuthService.verifyEmail(token)
                    if (res.status === 200) {
                        setIsLoading(false)
                        setIsVerified(true)
                    }
                } catch(err:any) {
                    if (err.response) {
                        if(err.response.status === 402){
                            setIsVerified(true)
                        }
                        alert(err.response.data.message);
                    } else {
                        console.error('Error occurred while setting up the request:', err.message);
                    }
                    setIsLoading(false);
                }
            }

            sendRequest()
        }

    }, [])

    if (isVerified) {
        return <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
            <div className="max-w-xl px-5 text-center">
                <h2 className="mb-2 text-[42px] font-bold text-zinc-800">Email Verified</h2>
                <p className="mb-2 text-lg text-zinc-500">Your email has been successfully verified.</p>
                <p className="mb-2 text-lg text-zinc-500">You can now proceed to login.</p>
                <Link to="/signin" className="mt-3 inline-block w-96 rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700">
                    Go to Login Page →
                </Link>
            </div>
        </div>
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white ">
            <div className={isLoading ? "blur-sm max-w-xl px-5 text-center" : " max-w-xl px-5 text-center"}>
                <h2 className="mb-2 text-[42px] font-bold text-zinc-800">Check your inbox</h2>
                <p className="mb-2 text-lg text-zinc-500">We are glad, that you’re with us ? We’ve sent you a verification link to your email address.</p>
                <a href="https://gmail.com" className="mt-3 inline-block w-96 rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700">Open your mail →</a>
            </div>
            {isLoading ? (
                <>
                    <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 ">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

export default VerifyEmail
