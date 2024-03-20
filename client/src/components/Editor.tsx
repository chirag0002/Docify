import { useEffect, useState } from "react";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { Socket, io } from "socket.io-client"
import { DocumentService } from "../services/document-service";
import { useSetRecoilState } from "recoil";
import { onlineUsersAtom } from "../hooks/atom";
import arrow from '../assets/arrow.png'

export const Editor = ({
    doc,
    id,
    permission
}: {
    permission: boolean,
    doc: { title: string; content: string; userId: string; },
    id?: string
}) => {

    const token = sessionStorage.getItem('token');
    const [socket, setSocket] = useState<Socket | null>(null)
    const [content, setContent] = useState(doc.content)
    const [timer, setTimer] = useState<number | null>(null);
    const setOnlineUsers = useSetRecoilState(onlineUsersAtom)


    useEffect(() => {
        setContent(doc.content);
    }, [doc.content]);

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
                setOnlineUsers(emails.map((email: string) => ({ email })));
            })

            socket.on("mouse-move", ({ data, userEmail }) => {
                const mouseCursor = document.getElementById("user-mouse-cursor");
                const userNameDisplay = document.getElementById("user-mouse-name");

                if (mouseCursor && userNameDisplay) {
                    mouseCursor.style.left = `${data.x}px`;
                    mouseCursor.style.top = `${data.y}px`;
                    mouseCursor.style.display = "block";

                    userNameDisplay.innerText = userEmail; 
                    userNameDisplay.style.left = `${data.x + 15}px`;
                    userNameDisplay.style.top = `${data.y}px`;
                    userNameDisplay.style.display = "block";
                }
            });

            return (): void => {
                socket.off("receive-content", handleReceiveContent);
            };
        }
    }, [socket, setContent]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (socket) {
                socket.emit("mouse-move", { x: event.clientX, y: event.clientY });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [socket]);

    const contentInput = (value: string) => {
        if (timer) {
            clearTimeout(timer);
        }

        setContent(value);
        socket?.emit("content", value)

        const newTimer = setTimeout(async () => {
            if (token && id) {
                await DocumentService.update(token, { id, content: value });
            }
        }, 1000);
        setTimer(newTimer);
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
            <div className="h-screen w-4/5 md:w-3/5 m-auto bg-white shadow-lg">
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={(e) => contentInput(e)}
                    className="h-screen w-full"
                    modules={modules}
                    readOnly={permission}
                />
            </div>
            <div id="user-mouse-cursor" style={{ position: 'absolute', width: '10px', height: '10px', display: 'none' }}>
                <img src={arrow} alt="" />
            </div>
            <div id="user-mouse-name" className="font-thin" style={{ position: 'absolute', display: 'none', fontSize:"10px" }}>d</div>
        </div>
    );
};