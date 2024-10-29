'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { Search, ChevronUp, ChevronDown, Moon, Sun, Eye, Command } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type User = {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
  phone: string
  website: string
  company: {
    name: string
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<'name' | 'username'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const { theme, setTheme } = useTheme()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const usersPerPage = 6

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      const data = await response.json()
      setUsers(data)
      setFilteredUsers(data)
      setLoading(false)
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [searchTerm, users])

  const handleSort = (field: 'name' | 'username') => {
    const direction = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortDirection(direction)
    const sorted = [...filteredUsers].sort((a, b) => {
      if (a[field].toLowerCase() < b[field].toLowerCase()) return direction === 'asc' ? -1 : 1
      if (a[field].toLowerCase() > b[field].toLowerCase()) return direction === 'asc' ? 1 : -1
      return 0
    })
    setFilteredUsers(sorted)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#000000] dark:text-gray-100" >
      <header className="border-b border-gray-200 dark:border-[#333333] bg-white dark:bg-black">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" className="h-8 w-auto mr-2" width={32} height={32} />
            <span className='text-2xl font-medium bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent'>VeriSync</span>
          </div>
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 dark:hover:bg-[#1A1A1A]"
          >
            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name or username"
              className="pl-10 w-full bg-white dark:bg-[#111111] border-gray-200 dark:border-[#333333] focus:ring-red-500 dark:focus:ring-red-400 focus:border-red-500 dark:focus:border-red-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 dark:text-gray-500">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-[#191919] rounded border border-gray-200 dark:border-[#333333] flex items-center ">
                <Command className="h-4 w-4" />
                <span className="text-sm">+K</span>
              </kbd>
            </div>
          </div>
        </div>

        <div className="mb-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => handleSort('name')}
            className="border-gray-200 dark:border-[#333333] dark:bg-[#111111] dark:hover:bg-[#191919]"
          >
            Sort by Name
            {sortField === 'name' && (
              sortDirection === 'asc' ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSort('username')}
            className="border-gray-200 dark:border-[#333333] dark:bg-[#111111] dark:hover:bg-[#191919]"
          >
            Sort by Username
            {sortField === 'username' && (
              sortDirection === 'asc' ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />
            )}
          </Button>
        </div>

        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 border-solid"></div>
            </div>
          )}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentUsers.map(user => (
              <motion.div
                key={user.id}
                variants={itemVariants}
                className="group bg-white dark:bg-[#111111] rounded-lg border border-gray-200 dark:border-[#333333] overflow-hidden hover:border-red-500 dark:hover:border-red-400 transition-colors duration-300 relative"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-500 dark:bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold dark:text-gray-100">{user.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
                  <p className="text-gray-600 dark:text-gray-400">{user.company.name}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 dark:hover:bg-[#191919]"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#333333]">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 dark:text-gray-100">{user.name}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 text-gray-600 dark:text-gray-400">
                      <p><strong className="text-gray-900 dark:text-gray-100">Username:</strong> {user.username}</p>
                      <p><strong className="text-gray-900 dark:text-gray-100">Email:</strong> {user.email}</p>
                      <p><strong className="text-gray-900 dark:text-gray-100">Phone:</strong> {user.phone}</p>
                      <p><strong className="text-gray-900 dark:text-gray-100">Website:</strong> {user.website}</p>
                      <p><strong className="text-gray-900 dark:text-gray-100">Address:</strong> {user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}</p>
                      <p><strong className="text-gray-900 dark:text-gray-100">Company:</strong> {user.company.name}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {!loading && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="mr-2 bg-white dark:bg-[#111111] border-gray-200 dark:border-[#333333] hover:bg-gray-100 dark:hover:bg-[#191919] disabled:hover:bg-white dark:disabled:hover:bg-[#111111]"
              variant="outline"
            >
              Previous
            </Button>
            <span className="mx-4 flex items-center text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-2 bg-white dark:bg-[#111111] border-gray-200 dark:border-[#333333] hover:bg-gray-100 dark:hover:bg-[#191919] disabled:hover:bg-white dark:disabled:hover:bg-[#111111]"
              variant="outline"
            >
              Next
            </Button>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 dark:border-[#333333] bg-white dark:bg-black mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
          © 2024 VeriSync Labs. All rights reserved.
        </div>
      </footer>
    </div>
  )
}