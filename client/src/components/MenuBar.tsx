import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import logo from '../assets/logo.png'
import { DocumentService } from '../services/document-service';
import { documentAtom, onlineUsersAtom } from '../hooks/atom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useParams, Link } from 'react-router-dom';
import { ShareModal } from './ShareModal';

export const DocumentMenuBar = () => {

    const [document, setDocument] = useRecoilState(documentAtom)
    const { id } = useParams()
    const token = sessionStorage.getItem('token');
    const [showShareModal, setShowShareModal] = useState(false);


    let timer: number

    useEffect(() => {
        if (id && token) {
            const documentId = parseInt(id)
            DocumentService.get(token, documentId).then(res => {
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

    const closeModal = (e: FormEvent<Element>) => {
        e.stopPropagation();
        setShowShareModal(false);
    };

    return (
        <div className="w-full flex justify-between items-center px-3 pb-1 border-b">
            <div className="w-full flex justify-start items-center overflow-x-hidden md:overflow-visible">
                <Link to='/'> 
                    <img src={logo} alt="" className="flex flex-shrink-0 justify-center items-center w-10 h-12 mx-5" />
                </Link>    
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
                        <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md hidden md:block">
                            Format
                        </button>
                        <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md hidden md:block">
                            Tools
                        </button>
                        <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md hidden md:block">
                            Add-ons
                        </button>
                        <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md hidden md:block">
                            Help
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex justify-between'>
                <button
                    className='mr-7 md:mr-10 lg:mr-14 bg-blue-700 rounded-full w-20 text-white font-medium'
                    onClick={() => setShowShareModal(true)}
                >
                    Share
                </button>
                <div>
                    <CurrentUsers />
                </div>
            </div>
            {(showShareModal && id) && <ShareModal id={parseInt(id)} closeModal={closeModal} />}
        </div>
    );
};


const CurrentUsers = () => {
    const onlineUsers = useRecoilValue(onlineUsersAtom)

    const colors = [
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

    const getRandomColor = () => {
        const colorIndex = Math.floor(Math.random() * 17);
        return colors[colorIndex];
    };

    return (
        <div className="flex">
            {onlineUsers.map((user, index) => (
                <div key={index}>
                    <div
                        key={index}
                        className={`${getRandomColor()} cursor-pointer w-8 h-8 text-white font-semibold flex justify-center items-center rounded-full flex-shrink-0 uppercase ring-2`}
                        style={{ marginLeft: "-10px" }}
                        title={user.email}
                    >
                        {user.email[0]}
                    </div>
                </div>
            ))}
        </div>
    );
};
