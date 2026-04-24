import React, { useEffect, useState } from "react"
import Footer from "../components/Footer";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { blogDb } from "../config/firebase";
import { getDoc, updateDoc, doc } from "firebase/firestore";


const EditBlog =({item, inModal=false}) => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    visibility: 'public',
    status: 'published',
    publishedDate: new Date().toISOString().split('T')[0]
  })
  const [image, setImage] = useState([])

  const navigate = useNavigate()

  const { id } = useParams()

  const location = useLocation()
  const editBlogState = location?.state
  const editPost = item || editBlogState


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    setImage(e.target.file[0])
  }

  const handleCheckbox = (e) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.checked ? 'published' : 'draft'
    }))
  }

  const editNofitication = () => {
    toast("Blog post updated successfully!")
  }

  const handlePostUpdate = async (e) => {
    e.preventDefault()

    const blogPostsDoc = doc(blogDb, "blog_posts", id)
    await updateDoc(blogPostsDoc, {
      title: formData.title,
      body: formData.body,
      visibility: formData.visibility,
      status: formData.status,
      publishedDate: new Date(formData.publishedDate),
      updatedAt: Date.now()
    })
    editNofitication()
    navigate('/home')
    
  }

  useEffect(() => {
    const getBlog = async(id) => {
      const blogRef = doc(blogDb, "blog_posts", id)
      const blogSnapShot = await getDoc(blogRef)

      if(blogSnapShot.exists()) {
        const blogData = blogSnapShot.data()

        let dateString = new Date().toISOString().split('T')[0]
        if(blogData.publishedDate) {
          if(blogData.publishedDate.toDate) {
            dateString = blogData.publishedDate.toDate().toISOString().split('T')[0]
          } else if(blogData.publishedDate instanceof Date) {
            dateString = blogData.publishedDate.toISOString().split('T')[0]
          }else if(typeof blogData.publishedDate === 'string') {
            dateString = blogData.publishedDate
          }
        }
        setFormData({
          title: blogData.title,
          body: blogData.body,
          status: blogData.status,
          visibility: blogData.visibility,
          publishedDate: dateString
        })
      }
    }
    getBlog(id)
  }, [id])


  const editBlogForm = (
    <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-semibold text-blue-800 mb-4">
          Update Blog Post
        </h2>

        <form
          onSubmit={handlePostUpdate}
          className=" space-y-8"
        >

          <div className="w-full">
            <label
              htmlFor="title"
              className="block text-blue-900 font-medium mb-2 text-lg"
            >
              Title
            </label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your title..."
              className="w-full h-14 px-5 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-gray-800 text-base"
            />
          </div>

          <div className="w-full">
            <label
              htmlFor="body"
              className="block text-blue-900 font-medium mb-2 text-lg"
            >
              Blog Post
            </label>
            <textarea
              name="body"
              rows="10"
              value={formData.body}
              onChange={handleChange}
              placeholder="Write your post here..."
              className="w-full h-60 px-5 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-none text-gray-800 text-base"
            />
          </div>


        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">Image</label>
          <input 
            type="file"
            name="image"
            value={formData.image}
            onChange={handleImage}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
        </div>

          <div>
            <label className="block text-sm font-medium text-blue-900 mb-2">Visibility</label>
            <select 
              name="visibility" 
              value={formData.visibility} 
              onChange={handleChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="public">public</option>
              <option value="private">private</option>
            </select>
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              name="publisheCheckBox" 
              onChange={handleCheckbox}
              checked={formData.status === 'published'}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded" 
              />
            <label className="ml-2 text-sm font-medium text-blue-900">publish or uncheck to draft</label>
          </div>

          <div>
            <label htmlFor="publishedDate" className="block text-sm font-medium text-blue-900 mb-2">Published date</label>
            <input 
              type="date" 
              name="publishedDate" 
              value={formData.publishedDate}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
              onChange={handleChange}
              />
          </div>

            <button
              className="w-full bg-blue-600 text-white text-center font-semibold py-4 rounded-lg hover:bg-blue-700 transition duration-200 text-lg"
              type="submit"
            >
              Submit
            </button>
        </form>
    </div>
  )

  return (
    <>
      {!inModal && (
      <div>
        <section className="flex items-center justify-center min-h-screen">
          <div className="w-[70%] p-10 rounded-2xl">
            {editBlogForm}
          </div>
        </section>
        <Footer />
      </div>
      )}

      {inModal && (
        <div className="">
          {editBlogForm}
        </div>
      )}
    </>
  )
}

export default EditBlog