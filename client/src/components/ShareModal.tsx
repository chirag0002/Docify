import { FormEvent, useEffect, useState } from "react";
import { DocumentUserService } from "../services/document-user-service";
import { DocumentService } from "../services/document-service";
import { useRecoilState } from "recoil";
import { documentUsersAtom } from "../hooks/atom";

export const ShareModal = ({ closeModal, id }: { closeModal: (e: FormEvent<Element>) => void, id?: number }) => {
    const [email, setEmail] = useState("");
    const [documentUsers, setDocumentUsers] = useRecoilState(documentUsersAtom)
    const [permission, setPermission] = useState("VIEW");
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("userId");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (email && permission && token) {
            DocumentUserService.create(token, { email, permission, documentId: id }).then(res => {
                alert(res.data.message);
            }).catch((err: any) => alert(err.response.data.message))
        }
        closeModal(e);
    };

    const handleUserDelete = (sharedUser: number) => {
        if (token && id && userId) {
            DocumentUserService.delete(token, {documentId:id, userId:sharedUser}).then(res => {
                alert(res.data.message);
            }).catch((err: any) => alert(err.response.data.message))
        }
    }

    useEffect(() => {
        if (token && id) {
            DocumentService.get(token, id).then(res => {
                setDocumentUsers(res.data.document.sharedUsers );
            }).catch((err: any) => alert(err.response.data.message))
        }
    }, [])


    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white p-8 rounded-lg w-2/5">
                <h2 className="text-lg font-semibold mb-4">Share Document</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1">Email:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-full" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1">Collaborators:</label>
                        <div className="overflow-y-auto h-32">
                            <div className="rounded shadow bg-zinc-100 p-4 flex flex-col">
                                {documentUsers.map(documentUser => {
                                    return (
                                        <div key={documentUser.id} className=" flex justify-between m-1">
                                            <div>{documentUser.email}</div>
                                            <button onClick={() => handleUserDelete(documentUser.id)} className="hover:bg-gray-300 rounded-3xl w-5 flex justify-center flex-col items-center">
                                                <svg fill="#000000" width="12px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 290 290">
                                                    <g id="XMLID_24_">
                                                        <g id="XMLID_29_">
                                                            <path d="M265,60h-30h-15V15c0-8.284-6.716-15-15-15H85c-8.284,0-15,6.716-15,15v45H55H25c-8.284,0-15,6.716-15,15s6.716,15,15,15h5.215H40h210h9.166H265c8.284,0,15-6.716,15-15S273.284,60,265,60z M190,60h-15h-60h-15V30h90V60z" />
                                                        </g>
                                                        <g id="XMLID_86_">
                                                            <path d="M40,275c0,8.284,6.716,15,15,15h180c8.284,0,15-6.716,15-15V120H40V275z" />
                                                        </g>
                                                    </g>
                                                </svg>
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="permission" className="block mb-1">Permission:</label>
                        <select id="permission"
                            value={permission}
                            onChange={(e) => {
                                e.stopPropagation();
                                setPermission(e.target.value)
                            }}
                            className="border border-gray-300 rounded px-2 py-1 w-full"
                        >edit
                            <option value="VIEW">View Only</option>
                            <option value="EDIT">Edit</option>
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={closeModal} className="mr-2 px-4 py-2 border border-gray-300 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Share</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
