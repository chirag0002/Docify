import { ChangeEvent, useEffect, useState } from 'react';
import logo from '../assets/logo.png'
import { DocumentService } from '../services/document-service';
import { documentAtom } from '../hooks/atom';
import { useRecoilState } from 'recoil';
import { useParams } from 'react-router-dom';

export const DocumentMenuBar = () => {

    const [document, setDocument] = useRecoilState(documentAtom)
    const { id } = useParams()
    const token = sessionStorage.getItem('token');

    let timer: number

    useEffect(() => {
        if (id && token) {
            DocumentService.get(token, id).then(res => {
                setDocument({
                    title: res.data.document.title,
                    content: res.data.document.content,
                    userId: res.data.document.userId
                })
            })

        }
    }, [])

    

    const titleInput = (e: ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timer);
        const { value } = e.target;
        setDocument(prevDocument => ({
            ...prevDocument,
            title: value
        }));
        timer = setTimeout(async () => {
            if (token && id) {
                await DocumentService.update(token, { id, title: value });
            }
        }, 400);
    };

    return (
        <div className="w-full flex justify-between items-center px-3 pb-1 border-b">
            <div className="w-full flex justify-start items-center overflow-x-hidden md:overflow-visible">
                <img src={logo} alt="" className="flex flex-shrink-0 justify-center items-center w-10 h-12 mx-5" />
                <div className="flex flex-col">
                    <input
                        maxLength={25}
                        type="text"
                        value={document.title ? document.title : ""}
                        className="font-medium text-lg px-2 pt-2 outline-none"
                        placeholder="Untitled Document"
                        onChange={(e) => titleInput(e)}
                    />
                    <div className="flex items-center">
                        <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
                            File
                        </button>
                        <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
                            Edit
                        </button>
                        <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
                            View
                        </button>
                        <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
                            Insert
                        </button>
                        <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
                            Format
                        </button>
                        <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
                            Tools
                        </button>
                        <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
                            Add-ons
                        </button>
                        <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
                            Help
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <CurrentUsers />
            </div>
        </div>
    );
};


const CurrentUsers = () => {
    const { backgroundColor } = useRandomBackground();
    return (

        <div className={`${backgroundColor} w-8 h-8 text-white font-semibold flex justify-center items-center rounded-full flex-shrink-0 uppercase ring-2`}>
            A
        </div>
    );


};


export const colors = [
    "bg-red-700",
    "bg-orange-700",
    "bg-amber-700",
    "bg-yellow-700",
    "bg-lime-700",
    "bg-green-700",
    "bg-emerald-700",
    "bg-teal-700",
    "bg-cyan-700",
    "bg-sky-700",
    "bg-blue-700",
    "bg-indigo-700",
    "bg-violet-700",
    "bg-purple-700",
    "bg-fuchsia-700",
    "bg-pink-700",
    "bg-rose-700",
];

const useRandomBackground = () => {
    const [backgroundColor, setBackgroundColor] = useState<string>("");

    useEffect(() => {
        setBackgroundColor(colors[Math.floor(Math.random() * colors.length)]);
    }, []);

    return {
        backgroundColor,
    };
};
