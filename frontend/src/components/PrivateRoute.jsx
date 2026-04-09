import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import Spinner from './Spinner'

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext)
    if (loading) return <div className='spinner'>Loading...</div>
    return user ? children : <Navigate to='/login' />
}

export default PrivateRoute
