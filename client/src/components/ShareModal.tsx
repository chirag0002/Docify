import { FormEvent, useState } from "react";
import { DocumentUserService } from "../services/document-user-service";

export const ShareModal = ({ closeModal, id }: { closeModal: (e: FormEvent<Element>) => void, id?:number}) => {
    const [email, setEmail] = useState("");
    const [permission, setPermission] = useState("VIEW");
    const token = sessionStorage.getItem("token");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (email && permission && token) {
            
                DocumentUserService.create(token, {email, permission, documentId:id}).then(res => {
                    alert(res.data.message);
                }).catch((err:any) => {
                    alert(err.response.data.message)
                })
        }
        closeModal(e);
    };


    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg w-2/5">
                <h2 className="text-lg font-semibold mb-4">Share Document</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1">Email:</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-full" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1">Collaborators:</label>
                        <textarea readOnly={true} id="email" value={""} className="border border-gray-300 rounded px-2 py-1 w-full" />
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
