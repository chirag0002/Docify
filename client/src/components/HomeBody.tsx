import { useNavigate } from "react-router-dom";
import { DocumentCard } from "./DocumentCard";
import { useEffect, useState } from "react";
import { DocumentService } from "../services/document-service";
import { DocumentInterface } from "../interfaces/interfaces";

export const Body = () => {
    const navigate = useNavigate()
    const [documents, setDocuments] = useState<DocumentInterface[]>([])
    const newDocument = async () => {
        const token = sessionStorage.getItem('token');
        if (token) {
            try {
                const response = await DocumentService.create(token)
                console.log(response)
                navigate(`/document/${response.data.document.id}`)
            } catch (err: any) {
                alert(`Error: ${err.message}`)
            }
        }
    }

    useEffect(() => {
        try {
            const token = sessionStorage.getItem('token');
            if (token) {
                DocumentService.list(token).then(res => {
                    setDocuments(res.data.documents)
                })
            }
        } catch (err) {
            console.log(err)
        }
    }, [])

    return <div className="flex flex-col  bg-gray-200 p-8 min-h-screen">

        <div className="w-4/5 mx-auto mb-5">
            <button onClick={newDocument}>
                <div className="flex flex-col items-center justify-center bg-white rounded shadow-lg w-28 h-32 md:w-32 md:h-36 lg:w-40 lg:h-44 ml-6 md:ml-9">
                    <div className="text-gray-400 font-thin bg-gradient-to-r from-red-500 via-green-500  to-blue-400 inline-block text-transparent bg-clip-text text-7xl md:text-8xl lg:text-9xl">+</div>
                    <p className="text-sm text-gray-800">Blank</p>
                </div>
            </button>
        </div>
        <div className="w-4/5 mx-auto mb-5">
            <h2 className="self-start text-lg font-semibold text-gray-700 mb-4 ml-9">Recent Documents</h2>
            <div className="flex flex-wrap justify-start">
                {documents.map(document => {
                    return (
                        <DocumentCard
                            key={document.id}
                            id={document.id}
                            name={document.title}
                            content={document.content}
                            date={document.updated_at}
                            onClick={() => navigate(`/document/${document.id}`)}
                        />)
                })}
            </div>
        </div>
    </div>
}