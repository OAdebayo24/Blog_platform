


const Button = ({
  label = "Click",
  variant = "primary",
  onClick,
  className = ""
}) => {

  const variants = {
    primary : "bg-blue-600 hover:bg-blue-700 text-white",
    success : "bg-green-600 hover:bg-green-700 text-white",
    danger : "bg-red-600 hover:bg-red-700 text-white",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100"
  }

  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out cursor-pointer ${variants[variant]} ${className}`}
    >{label}</button>
  )
}

export default Button