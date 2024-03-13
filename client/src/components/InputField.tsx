import { useState } from "react";
import { LabeledInputType } from "../interfaces/interfaces";

export const LabeledInput = ({ label, placeholder, onChange, type }: LabeledInputType) => {

    const [clicked, setClicked] = useState<boolean>(false)

    if (type === "password") {
        return <div>
            <label className="block mb-1 text-sm font-medium">{label}</label>
            <div className="relative mt-1 mb-5">
                <input
                    onChange={onChange}
                    type={clicked ? "text" : type}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    className="absolute top-0 end-0 p-3.5 rounded-e-md"
                    onClick={() => {
                        setClicked(!clicked)
                    }}
                >
                    <svg className="flex-shrink-0 size-3.5 text-gray-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {clicked ? (
                            <>
                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                            </>
                        ) : (
                            <>
                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                <line x1="2" x2="22" y1="2" y2="22" />
                            </>
                        )}
                    </svg>
                </button>
            </div>
        </div>
    }

    return <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">{label}</label>
        <input onChange={onChange} type={type} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-96 p-2.5" placeholder={placeholder} required={true} />
    </div>

}