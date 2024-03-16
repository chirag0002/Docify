import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { Socket, io } from "socket.io-client"

export const Editor = ({
    content,
    setContent,
    id,
    permission
}: {
    permission: boolean,
    content: string,
    setContent: Dispatch<SetStateAction<string>>,
    id?: string
}) => {

    const token = sessionStorage.getItem('token');
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socket = io('http://localhost:8080', {
            query: {
                accessToken: token,
                documentId: id
            }
        })
        setSocket(socket)

        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        if (socket) {
            const handleReceiveContent = (content: string): void => {
                setContent(content);
            };
            socket.on("receive-content", handleReceiveContent);
            
            socket.on("send_emails", (emails) => {
                console.log(emails)
            })
            return (): void => {
                socket.off("receive-content", handleReceiveContent);
            };
        }
    }, [socket, setContent]);

    const contentInput = (value: string) => {
        socket?.emit("content", value)
    };

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ]
    }

    return (
        <div className="bg-gray-100">
            <div className="h-screen w-3/5 m-auto bg-white shadow-lg">
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={(e) => contentInput(e)}
                    className="h-screen w-full"
                    modules={modules}
                    readOnly={permission}
                />
            </div>
        </div>
    );
};
