import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { isLoading, forgotPassword } = useAuthStore();

    const handleSubmit = async(e) => {
        e.preventDefault();
        await forgotPassword(email);
        setIsSubmitted(true);
    }

    return (
        <div className='bg-[#AEF6D9] min-h-screen flex flex-col items-center justify-center p-6'>
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <h2 className='text-3xl font-bold text-[#28a173]'>Forgot Password</h2>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <p className="text-[#28a173] text-center mb-6">
                            Enter your email and we'll send you a link to reset your password
                        </p>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-[#28C689]">
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#51dba6] focus:border-transparent"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#22b178e0] hover:bg-[#20C683] text-white font-medium py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="p-4 bg-green-50 rounded-lg">
                            <p className="text-[#0A8754]">
                                If an account exists for <span className="font-semibold">{email}</span>, you will receive a password reset link.
                            </p>
                        </div>
                        <p className="text-[#0A8754]">
                            Didn't receive the email? Check your spam folder or <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-[#22a370] hover:underline font-medium"
                            >
                                try again
                            </button>.
                        </p>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link
                        to='/login'
                        className="inline-flex items-center text-[#0A8754] hover:text-[#0f766c] font-medium "
                    >
                        <ArrowLeft className="mr-1 h-5 w-5" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;