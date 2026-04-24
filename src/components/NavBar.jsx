import { Link } from "react-router-dom"
import Button from "../components/Button"




const NavBar = () => {


  return (
    <main className="w-full bg-blue-300">
      <nav className="max-w-6xl mx-auto h-[100px] flex items-center justify-between px-8">
      
        <h3 className="text-2xl font-semibold text-white">Blog</h3>

        <ul className="flex gap-8 text-white font-medium">
          <li className="cursor-pointer">Home</li>
          <li className="cursor-pointer">Blogs</li>
          <li className="cursor-pointer">Products</li>
        </ul>

        <Link to="/create-blog">
          <Button label="Create Blog" variant="primary"/>
        </Link>
      </nav>
    </main>
  )
}

export default NavBar