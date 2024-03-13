import { Body } from "../components/HomeBody"
import { Footer } from "../components/Footer"
import { Navbar } from "../components/Navbar"

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-8">
        <Navbar />
      </div>
      <div className="flex-grow">
        <Body />
      </div>
      <Footer />
    </div>
  )
}

export default Home