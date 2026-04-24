

const Footer = () => {
  return (
    <footer className="bg-blue-300 text-white py-10 mt-10">
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 px-6">
        <section>
          <h5 className="text-lg font-semibold mb-4 border-b border-white/30 inline-block pb-1">
            Legal
          </h5>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-100 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-blue-100 cursor-pointer">Terms of Service</li>
            <li className="hover:text-blue-100 cursor-pointer">Lawyers Corner</li>
          </ul>
        </section>

        <section>
          <h5 className="text-lg font-semibold mb-4 border-b border-white/30 inline-block pb-1">
            Site Map
          </h5>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-blue-100 cursor-pointer">Technology</li>
            <li className="hover:text-blue-100 cursor-pointer">Contact Us</li>
            <li className="hover:text-blue-100 cursor-pointer">Portal</li>
            <li className="hover:text-blue-100 cursor-pointer">Resources & News</li>
          </ul>
        </section>
      </section>

      <section className="text-center text-sm mt-10 text-blue-100">
        &copy; {new Date().getFullYear()} Blog Platform. All rights reserved.
      </section>
    </footer>
  )
}

export default Footer
