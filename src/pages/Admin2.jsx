import { useEffect, useState } from "react"
import Button from "../components/Button"
import AdminModal from "../components/AdminModal"

const Admin = () => {
  const [post, setPost] = useState([])
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState()
  const [deleteData, setDeleteData] = useState({})
  const [selectedItem, setSelectedItem] = useState(null)


  const getPostData = () => {
    const blogPostData = JSON.parse(localStorage.getItem("formData"))
    setPost(blogPostData.reverse())
    // console.log(blogPostData)
    // console.log('get data from db')
  } 

  useEffect(() => {
    getPostData()
  }, [])

  const deletePost = (id) => {
    const existingPost = JSON.parse(localStorage.getItem('formData'))
    const newPostData = existingPost.filter((post) => post.id !== id)
    setPost(newPostData)
    localStorage.setItem('formData', JSON.stringify(newPostData))
    setOpen(false)
  }

  const openDelete = (data) => {
    setDeleteData(data)
    setMode("delete")
    setOpen(true)
  }

  const adminView = (data) => {
    setSelectedItem(data)
    setMode("view")
    setOpen(true)
  }

  const adminEdit = (data) => {
    setSelectedItem(data)
    setMode("edit")
    setOpen(true)
  }

   const handlePostUpdate = (e) => {
    e.preventDefault()
    
    const postData = JSON.parse(localStorage.getItem('formData') || '[]')
    
    const index = postData.findIndex(blog => blog.id === formData.id)
    
    if (index !== -1) {
      postData[index] = {
        ...postData[index],
        title: formData.title,
        body: formData.body
      }
      
      localStorage.setItem('formData', JSON.stringify(postData))
      // setOpen(false)
      editNofitication()
      
      // alert('Blog post updated successfully!')
      // navigate('/home')
    } else {
      alert('Post not found!')
    }
    
    console.log('Index found:', index)
    console.log('Unique Key:', formData.uniqueKey)
  }

  return (
  <>
    <h1 className="text-3xl font-bold text-center m-10">BLOG POST DATA TABLE</h1>
    <table className="w-full table-fixed border-collapse">
      <thead className="bg-blue-300">
        <tr className="border-b">
          <th className="w-1/12 p-3 text-center">ID</th>
          <th className="w-3/12 p-3 text-center">Title</th>
          <th className="w-5/12 p-3 text-center">Body</th>
          <th className="w-3/12 p-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>

      {post.slice(0, 15).map((data, id) => (
          <tr key={data.id} className="border-b hover:bg-gray-50">
            <td className="p-3">{data.id}</td>

            <td className="p-3 break-words">
              {data.title}
            </td>

            <td className="p-3 break-words">
              {data.body}
            </td>

            <td className="p-3">
              <div className="flex items-center gap-2">

                <Button onClick={() => adminView(data)} className="border-none" label="View" variant="primary" />

                <Button onClick={() => adminEdit(data)} label="Edit" variant="success"/>

                <Button onClick={() => openDelete(data)} label="Delete" variant="danger" />
              </div>
            </td>
          </tr>
      ))}
      </tbody>  
    </table>

    <AdminModal 
      open={open}
      closeDeletePost={() => setOpen(false)}
      postId={deleteData.id}
      deleteFunction={()=>deletePost(deleteData.id)}
      mode={mode}
      selectedItem={selectedItem}
      editPost={handlePostUpdate}
    />
  </>
);

}

export default Admin
