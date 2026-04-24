import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"
import Button from "../components/Button"
import { blogDb } from "../config/firebase"
import { collection, onSnapshot } from "firebase/firestore"


const Home = () => {
  const [post, setBlogPost] = useState([])
  const [error, setError] = useState(null)

  // Helper function to convert any date format to timestamp
  const getTimestamp = (dateValue) => {
    if (!dateValue) return 0
    
    // Firestore Timestamp
    if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      return dateValue.toDate().getTime()
    }
    
    // JavaScript Date object
    if (dateValue instanceof Date) {
      return dateValue.getTime()
    }
    
    // Number (milliseconds)
    if (typeof dateValue === 'number') {
      return dateValue
    }
    
    // String
    if (typeof dateValue === 'string') {
      return new Date(dateValue).getTime()
    }
    
    return 0
  }

  // Helper function to convert any date format to Date object
  const toDateObject = (dateValue) => {
    if (!dateValue) return null
    
    // Firestore Timestamp
    if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      return dateValue.toDate()
    }
    
    // JavaScript Date object
    if (dateValue instanceof Date) {
      return dateValue
    }
    
    // Number (milliseconds)
    if (typeof dateValue === 'number') {
      return new Date(dateValue)
    }
    
    // String
    if (typeof dateValue === 'string') {
      return new Date(dateValue)
    }
    
    return null
  }

  useEffect(() => {
    const blogCollectionRef = collection(blogDb, "blog_posts")

    // Real-time listener
    const blogPosts = onSnapshot(blogCollectionRef, (snapshot) => {
      const filteredBlogItem = snapshot.docs
        .map((doc) => ({
          ...doc.data(),
          id: doc.id
        }))
        .filter(post => post.status === 'published' && post.visibility === 'public')
        .sort((a, b) => {
          // Sort by updatedAt (most recently updated appears first)
          const timestampA = getTimestamp(a.updatedAt) || getTimestamp(a.createdAt) || getTimestamp(a.publishedDate)
          const timestampB = getTimestamp(b.updatedAt) || getTimestamp(b.createdAt) || getTimestamp(b.publishedDate)
          
          return timestampB - timestampA // Most recent first
        })
      
      console.log('Filtered blogs:', filteredBlogItem)
      setBlogPost(filteredBlogItem)
    }, (err) => {
      console.error("Error fetching blogs:", err)
      setError(err.message)
    })

    // Cleanup listener on unmount
    return () => blogPosts()
  }, [])


  return ( 
    <main>
      <NavBar />
        <div className="grid grid-cols-3 gap-3 m-10">
          {error && (
            <p className="col-span-3 text-center text-red-600 text-lg">
              Error loading blogs: {error}
            </p>
          )}
          
          {!error && post.length > 0 ? (
            post.slice(0, 12).map((data) => {
              const publishedDate = toDateObject(data.publishedDate)
              const updatedDate = toDateObject(data.updatedAt)
              const createdDate = toDateObject(data.createdAt)
              
              return (
                <div key={data.id} className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition-all">
                  <Link 
                    to={`/blog-details/${data.id}`}
                    state={{title: data.title, body: data.body}}
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{data.title}</h2>
                  </Link>
                  <p className="text-gray-600 text-sm flex-1 line-clamp-3">{data.body}</p>
                  
                  <div className="flex justify-between mt-4">
                    <div className="flex flex-col">
                      {publishedDate && (
                        <p className="text-xs text-gray-500">
                          Published: {publishedDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                      {updatedDate && createdDate && 
                      updatedDate.getTime() !== createdDate.getTime() && (
                        <p className="text-xs text-blue-600 font-medium">
                          Updated: {updatedDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                    
                    <Link 
                      to={`/edit-blog/${data.id}`}
                      state={{title: data.title, body: data.body, id: data.id}}
                    >
                      <Button label="Edit" variant="success"/>
                    </Link>
                  </div>
                </div>
              )
            })
          ) : !error && (
            <p className="col-span-3 text-center text-gray-600 text-lg">Loading blogs...</p>
          )}
        </div>
      <Footer />
    </main>
  )
}

export default Home

