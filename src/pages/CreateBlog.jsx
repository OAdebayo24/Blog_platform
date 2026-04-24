import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { blogDb } from '../config/firebase'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage'

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    visibility: 'public',
    status: 'published',
    publishedDate: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState(null)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.checked ? 'published' : 'draft'
    }))
  }

  const handleImage = (e) => {
    setImage(e.target.files[0])
  }

  const notify = () => {
    toast("Blog posted successfully")
  }

  const uploadImage = async ({ image }) => {
    const storage = getStorage()
    const refImage = ref(storage, blog-images/image.name)
    await uploadBytes(refImage, image)
    const getURL = await getDownloadURL(refImage)
    return getURL
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const getImageUpload = await uploadImage({image})
    setLoading(true)
    notify()
    try {
      // Check if blogDb exists
      if (!blogDb) {
        throw new Error('blogDb is undefined or null')
      }

      // console.log('Creating collection reference...')
      
      // Create reference to collection
      const blogCollectionRef = collection(blogDb, 'blog_posts')
      
      // Add document to collection
      const docRef = await addDoc(blogCollectionRef, {
        title: formData.title,
        body: formData.body,
        image: getImageUpload,
        visibility: formData.visibility,
        status: formData.status,
        publishedDate: new Date(formData.publishedDate),
        createdAt: new Date()
      })
      
      // alert('Blog post created successfully!')
      // navigate('/')
      setFormData({
        title: '',
        body: '',
        image: '',
        visibility: 'public',
        status: 'draft', 
        publishedDate: new Date().toISOString().split('T')[0],
      })
    } catch (error) {
      console.error('Error message:', error.message)
      // alert('Failed to create blog post: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-blue-800 mb-4">Create New Blog Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-blue-900 font-medium mb-2 text-lg">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter blog title"
          />
        </div>

        <div>
          <label className="block text-blue-900 font-medium mb-2 text-lg">
            Content
          </label>
          <textarea
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            required
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Write your blog content here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Image
          </label>
          <input
            type="file"
            name="file"
            accept='image/*'
            onChange={handleImage}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter blog title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Visibility
          </label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="publishedCheckbox"
            checked={formData.status === 'published'}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="publishedCheckbox" className="ml-2 text-sm font-medium text-blue-900">
            Publish this post or uncheck to draft post
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-blue-900 mb-2">
            Published Date
          </label>
          <input
            type="date"
            name="publishDate"
            value={formData.publishedDate}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            onSubmit={handleSubmit}
            // disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Blog Post'}
          </button>
          
          {/* <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button> */}
        </div>
      </form>
    </div>
  )
}

export default CreateBlog
