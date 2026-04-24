import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { collection, getDocs, query, where } from "firebase/firestore"
import { blogDb } from "../config/firebase"
import Footer from "../components/Footer"
import { Link } from "react-router-dom"
import Button from "../components/Button"



const Draft = () => {
  const [drafted, setDrafted] = useState([])

  useEffect(() => {
    const getDraftedBlog = async() => {
      const blogCollectionRef = collection(blogDb, "blog_posts")

      const draftQuery = query(
        blogCollectionRef,
        where("status", "==", "draft"),
        where("visibility", "==", "private")
      )

      const querySnapShot = await getDocs(draftQuery)

      const draftedBlog = querySnapShot.docs.map((blog) => ({
        ...blog.data(),
        id: blog.id,
      }))

      setDrafted(draftedBlog)
    }

    getDraftedBlog()
  }, [])

  const convertDate = (dateType) => {
    if(!dateType) return ''

    try {
      if(dateType.toDate && typeof dateType.toDate === 'function'){
        return dateType.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }else if(typeof dateType === 'string') {
        return dateType.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }else if(dateType instanceof Date) {
        return dateType.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return ( 
    <main>
      <NavBar />
        <div className="grid grid-cols-3 gap-3 m-10">
          {drafted.length > 0 ? (
            drafted.slice(0, 12).map((data) => ( 
              <div key={data.id} className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition-all">
                <Link 
                  to={`/blog-details/${data.id}`}
                  state={{title: data.title, body: data.body}}
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{data.title}</h2>
                </Link>
                <p className="text-gray-600 text-sm flex-1 line-clamp-3">{data.body}</p>
                
                <div className="flex justify-between mt-4">
                  {data.publishedDate && (
                    <p className="text-xs text-gray-500 mt-2">
                      {convertDate(data.publishedDate)}
                    </p>
                )}
                    <Link 
                      to={`/edit-blog/${data.id}`}
                      state={{title: data.title, body: data.body, id: data.id}}
                    >
                      <Button label="Edit" variant="success"/>
                    </Link>
                  </div>
                </div> 
            ))
          ): (
            <p className="col-span-3 text-center text-gray-600 text-lg">Loading...</p>
          )}
        </div>
      <Footer />
    </main>
  )
}

export default Draft