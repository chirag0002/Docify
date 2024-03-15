import { useRecoilState } from "recoil"
import { Editor } from "../components/Editor"
import { DocumentMenuBar } from "../components/MenuBar"
import { documentAtom } from "../hooks/atom"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

const Document = () => {

  const [document, setDocument] = useRecoilState(documentAtom)
  const [readPermission, setReadPermission] = useState(true)
  const { id } = useParams()
  const userId = sessionStorage.getItem('userId')



  useEffect(() => {
    if (document.userId == userId) {
      setReadPermission(false)
    }
  }, [document])

  return (
    <div>
      <DocumentMenuBar />
      <Editor document={document} setDocument={setDocument} id={id} permission={readPermission} />
    </div>
  )
}

export default Document