import { BrowserRouter,Routes, Route } from 'react-router-dom'
import CreateBlog from './pages/CreateBlog'
import Home from './pages/Home'
import PostDetails from './pages/PostDetails'
import EditBlog from './pages/EditBlog'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"; 
import Admin from './pages/Admin2'
import Draft from './pages/Draft'
import Chart from './pages/Chart'


function App() {
  return (
  <>
    <ToastContainer position='top-center'/>

    <BrowserRouter>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/create-blog' element={<CreateBlog />} />
        <Route path='/blog-details/:id' element={<PostDetails />} />
        <Route path='/edit-blog/:id' element={<EditBlog />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/draft' element={<Draft />} />
        <Route path='/chart' element={<Chart />}/>
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App
