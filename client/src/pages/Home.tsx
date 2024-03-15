import { Body } from "../components/HomeBody"
import { Footer } from "../components/Footer"
import { Navbar } from "../components/Navbar"
import { useEffect } from "react"
import { useRecoilState } from "recoil"
import { userAtom } from "../hooks/atom"
import { AuthService } from "../services/auth-service"

const Home = () => {
  const [user, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    const token = sessionStorage.getItem('token');
    if (userId && token) {
      AuthService.getUser(userId, token).then(res => {
        setUser(res.data.user);
      })
    }
  },[])

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-8">
        <Navbar name={user.name} />
      </div>
      <div className="flex-grow">
        <Body />
      </div>
      <Footer />
    </div>
  )
}

export default Home