import { useState } from "react";
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { SetterOrUpdater } from "recoil";
import { DocumentService } from "../services/document-service";

export const Editor = ({ document, setDocument, id, permission }: { permission:boolean, document: { title: string; content: string; }, id?: string, setDocument: SetterOrUpdater<{ title: string; content: string; userId:string }> }) => {
    const token = sessionStorage.getItem('token');
    const [timer, setTimer] = useState<number | null>(null);

    let content = document.content;

    const contentInput = (value: string) => {
        if (timer) {
            clearTimeout(timer);
        }
        setDocument(document => ({
            ...document,
            content: value
        }));
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
