import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CarListing from './pages/CarListing'
import CarDetails from './pages/CarDetails'
import Booking from './pages/Booking'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Contact from './pages/Contact'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
)

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<PageWrapper><Home /></PageWrapper>} />
        <Route path='/login' element={<PageWrapper><Login /></PageWrapper>} />
        <Route path='/register' element={<PageWrapper><Register /></PageWrapper>} />
        <Route path='/cars' element={<PageWrapper><CarListing /></PageWrapper>} />
        <Route path='/cars/:id' element={<PageWrapper><CarDetails /></PageWrapper>} />
        <Route path='/contact' element={<PageWrapper><Contact /></PageWrapper>} />

        {/* Private Routes */}
        <Route path='/dashboard' element={<PrivateRoute><PageWrapper><Dashboard /></PageWrapper></PrivateRoute>} />
        <Route path='/booking/:id' element={<PrivateRoute><PageWrapper><Booking /></PageWrapper></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path='/admin' element={<AdminRoute><PageWrapper><AdminDashboard /></PageWrapper></AdminRoute>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col gap-0 overflow-x-hidden">
          <Header />
          <main className="flex-grow pt-24 text-white">
            <AnimatedRoutes />
          </main>
          <Footer />
          <ToastContainer position="bottom-right" theme="dark" />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
