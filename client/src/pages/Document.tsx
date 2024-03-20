import { useRecoilState } from "recoil"
import { Editor } from "../components/Editor"
import { DocumentMenuBar } from "../components/MenuBar"
import { documentAtom } from "../hooks/atom"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { DocumentUserService } from "../services/document-user-service"
import { DocumentService } from "../services/document-service"


const Document = () => {

  const [document, setDocument] = useRecoilState(documentAtom)
  const [readPermission, setReadPermission] = useState(false)
  const { id } = useParams()
  const userId = sessionStorage.getItem('userId')
  const token = sessionStorage.getItem('token')


  useEffect(() => {
    if (!token || !id) return
    
    DocumentService.get(token, parseInt(id)).then((response) => {
      setDocument(document => ({
        ...document,
        content: response.data.document.content
      }))
    }).catch(err => alert(err.response.data.message))

  }, [])

  useEffect(() => {
    if (userId && id && token && document.userId) {
      if (document.userId != userId) {
        DocumentUserService.check(token, { userId, documentId: id }).then(res => {
          const permission = res.data.permission
          if (permission == 'VIEW') setReadPermission(true)
        }).catch(err => alert(err.response.data.message))
      }
    }
  }, [document, userId, token, id])

  return (
    <div>
      <DocumentMenuBar />
      <Editor doc={document} id={id} permission={readPermission} />
    </div>
  )
}

export default Document