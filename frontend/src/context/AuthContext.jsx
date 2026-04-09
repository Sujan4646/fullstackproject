import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/users/login', { email, password })
            localStorage.setItem('user', JSON.stringify(response.data))
            setUser(response.data)
            return response.data
        } catch (error) {
            throw error.response?.data?.message || 'Login failed'
        }
    }

    const register = async (name, email, password) => {
        try {
            const response = await axios.post('/api/users', { name, email, password })
            localStorage.setItem('user', JSON.stringify(response.data))
            setUser(response.data)
            return response.data
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed'
        }
    }

    const logout = () => {
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
