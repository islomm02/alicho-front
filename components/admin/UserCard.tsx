import { UserType } from "@/types"


const UserCard = ({user}: {user:UserType}) => {
  return (
    <div className="group relative p-6 bg-gradient-to-br from-white via-blue-50 to-indigo-100 border border-blue-200/50 rounded-2xl shadow-md hover:shadow-xl transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative flex gap-6 items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-spin opacity-10 group-hover:opacity-30 transition-opacity duration-700" style={{animationDuration: '8s'}}></div>
          
          <img 
            className="relative z-10 object-cover w-16 h-16 border-2 border-white shadow-lg rounded-full transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"  
            alt="User Avatar" 
            src={user?.image ? user.image : "/profile.jpg"}  
          />
          
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm animate-bounce"></div>
        </div>
        
        <div className="flex-1 space-y-1">
          <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent transform transition-all duration-300 group-hover:scale-105">
            {user.name}
          </h2>
          <p className="text-gray-500 text-sm font-medium transition-colors duration-300 group-hover:text-gray-600 flex items-center">
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
            {user.email}
          </p>
          
          <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
            <div className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200/50">
              <span className="text-xs font-medium text-blue-600">Active</span>
            </div>
            <div className="px-3 py-1 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full border border-emerald-200/50">
              <span className="text-xs font-medium text-emerald-600">Verified</span>
            </div>
          </div>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <svg  className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
    </div>
  )
}

export default UserCard