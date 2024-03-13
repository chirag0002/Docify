import { useEffect, useState } from "react";
import { AuthService } from "../services/auth-service";
import { LabeledInput } from "../components/InputField";
import { Link, useNavigate, useParams } from "react-router-dom";

const ForgotPassword = () => {

    const { token } = useParams<{ token: string }>()
    const [isLinkSent, setIsLinkSent] = useState(false);
    const [isPasswordPage, setIsPassworPage] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setIsConfirmPassword] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const sentTimestamp = sessionStorage.getItem('resetLinkSentTimestamp');
        if (sentTimestamp) {
            const now = new Date().getTime();
            const elapsedTime = now - parseInt(sentTimestamp, 10);
            if (elapsedTime < 120000) {
                setIsLinkSent(true);
                const remainingTime = 120000 - elapsedTime;

                setTimeout(() => {
                    setIsLinkSent(false);
                    sessionStorage.removeItem('resetLinkSentTimestamp');
                }, remainingTime);
            }
        }
    }, []);

    useEffect(() => {
        if (token) {
            setIsPassworPage(true);
        }
    }, [])

    const changePassword = async () => {
        try {
            if (password === confirmPassword) {
                const res = await AuthService.confirmPassword({ password }, token)
                alert(res.data.message)
                navigate('/signin')
            } else {
                alert("Passwords are not matching!");
            }
        } catch (err: any) {
            console.log(err)
            alert(err.message)

        }
    }

    const handleSendResetLink = async () => {
        setIsLinkSent(true);

        try {
            const response = await AuthService.resetPassword({ email })
            alert(response.data.message);
            sessionStorage.setItem('resetLinkSentTimestamp', new Date().getTime().toString());
            setTimeout(() => {
                setIsLinkSent(false);
                sessionStorage.removeItem('resetLinkSentTimestamp');
            }, 120000);
        } catch (err: any) {
            setIsLinkSent(false)
            if (err.response) {
                alert(err.response.data.message);
            } else {
                console.error('Error occurred while setting up the request:', err.message);
            }
        }
    };

    if (isPasswordPage) {
        return (
            <div className="h-screen flex justify-center flex-col bg-slate-200">
                <div className="flex justify-center">
                    <div className="relative bg-white p-4 rounded-lg shadow-2xl">
                        <div className="max-w-xl text-center flex justify-center flex-col items-center">
                            <h2 className="mb-2 text-[42px] font-bold text-zinc-800">Reset your password?</h2>
                            <p className="mb-2 text-lg text-blue-500 font-medium">Please enter your new password below</p>
                            <div className="w-3/4 flex flex-col justify-start text-left mt-5">
                                <LabeledInput label="New Password" placeholder="****" type="password" onChange={(e) => { setPassword(e.target.value) }} />
                                <LabeledInput label="Confirm New Password" placeholder="****" type="password" onChange={(e) => { setIsConfirmPassword(e.target.value) }} />
                            </div>
                            <button
                                onClick={changePassword}
                                className="mt-3 inline-block w-96 rounded bg-[#2660dc] px-5 py-3 font-medium text-white"
                            >
                                Change Password
                            </button>
                            <div className="underline text-blue-500 font-medium text-center mt-1">
                                <Link to={"/signin"}>
                                    Back to signin
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isLinkSent) {
        return (
            <div className="h-screen flex justify-center flex-col bg-slate-200">
                <div className="flex justify-center">
                    <div className="relative bg-white p-4 rounded-lg shadow-2xl">
                        <div className="max-w-xl text-center">
                            <h2 className="mb-2 text-[42px] text-blue-500 font-medium">Password Reset Link Sent</h2>
                            <p className="mb-2 text-lg text-zinc-500">We've sent a password reset link to your email address.</p>
                            <p className="mb-2 text-lg text-zinc-500">Please check your inbox to continue.</p>
                            <a href="https://gmail.com" className="mt-3 inline-block w-96 rounded bg-[#2660dc] px-5 py-3 font-medium text-white shadow-md">Open your mail →</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex justify-center flex-col bg-slate-200">
            <div className="flex justify-center">
                <div className="relative bg-white p-4 rounded-lg shadow-2xl">
                    <div className="max-w-xl px-5 text-center flex justify-center flex-col items-center">
                        <h2 className="mb-2 text-[42px] font-bold text-zinc-800">Forgot your password?</h2>
                        <p className="mb-2 text-lg text-blue-500 font-medium">Please enter your linked email address below</p>
                        <LabeledInput label="" placeholder="abc@xyz.com" onChange={(e) => { setEmail(e.target.value) }} />
                        <button
                            onClick={handleSendResetLink}
                            className="mt-3 inline-block w-96 rounded bg-[#2660dc] px-5 py-3 font-medium text-white shadow-md"
                        >
                            Send reset link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ForgotPassword;
