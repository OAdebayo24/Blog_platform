import { useLocation, useParams } from "react-router-dom"

const PostDetails = ({item}) => {
  const { id } = useParams()
  const location = useLocation()
  const postDetailsState = location?.state

  const details = item || postDetailsState

  if(!details) {
    return (
      <main className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
        <p className="text-gray-800">No post found</p>
      </main>
    )
  }

  const { title, body } = details

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50 py-10 px-4">
      <article className="max-w-2xl w-ful rounded-xl p-8">
        {/* <p>{id}</p> */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 leading-snug text-center">{title}</h2>
        <p className="text-gray-700 text-lg leading-relaxed tracking-wide">{body}</p>
      </article>
    </main>
  )
}

export default PostDetails
