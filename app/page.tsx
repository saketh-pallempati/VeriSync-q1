'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Search, ChevronUp, ChevronDown, Moon, Sun } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<'name' | 'username'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const { theme, setTheme } = useTheme()

  const usersPerPage = 6

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
    <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" className="h-8 w-auto mr-2" width={32} height={32} />
            <span className=''>VeriSync Dashboard</span>
          </div>
          <Button onClick={toggleTheme} variant="outline" size="icon">
            {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search by name or username"
              className="pl-10 w-full dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => handleSort('name')}
            className="flex items-center dark:bg-gray-800 dark:text-white"
          >
            Sort by Name
            {sortField === 'name' && (
              sortDirection === 'asc' ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSort('username')}
            className="flex items-center dark:bg-gray-800 dark:text-white"
          >
            Sort by Username
            {sortField === 'username' && (
              sortDirection === 'asc' ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />
            )}
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <Skeleton className="h-6 w-2/3 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentUsers.map(user => (
              <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary text-white dark:bg-gray-700 dark:text-gray-200 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold dark:text-white">{user.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{user.email}</p>
                  <p className="text-gray-700 dark:text-gray-300">{user.company.name}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="dark:bg-gray-800 dark:text-white">
                      <DialogHeader>
                        <DialogTitle>{user.name}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Website:</strong> {user.website}</p>
                        <p><strong>Address:</strong> {user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}</p>
                        <p><strong>Company:</strong> {user.company.name}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="mr-2"
          >
            Previous
          </Button>
          <span className="mx-4 flex items-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-2"
          >
            Next
          </Button>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow-md mt-8">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-400">
          © 2024 VeriSync Labs. All rights reserved.
        </div>
      </footer>
    </div>
  )
}