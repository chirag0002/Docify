import { useRecoilState } from "recoil"
import { Editor } from "../components/Editor"
import { DocumentMenuBar } from "../components/MenuBar"
import { documentAtom } from "../hooks/atom"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { DocumentUserService } from "../services/document-user-service"


const Document = () => {

  const [document, setDocument] = useRecoilState(documentAtom)
  const [readPermission, setReadPermission] = useState(false)
  const { id } = useParams()
  const userId = sessionStorage.getItem('userId')
  const token = sessionStorage.getItem('token')
  const [content, setContent] = useState('')


  useEffect(() => {
    setDocument(document => ({
      ...document,
      content: content
    }))
  }, [content])

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
      <Editor content={content} setContent={setContent} id={id} permission={readPermission} />
    </div>
  )
}

export default Document