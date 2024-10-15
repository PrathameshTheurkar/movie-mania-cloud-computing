import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import PrivateRoutes from './PrivateRoutes'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import AddMovie from './pages/AddMovie'
import Movies from './pages/Movies'
import Layout from './Layout'
import Movie from './pages/Movie'
import { Toaster } from 'react-hot-toast'


const App = () => {

  return (
    <div className='px-5 py-0'>
    <RecoilRoot>
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<Layout /> }>
          <Route path='/movies' element={<Movies />} /> 
          <Route path='/addmovie'element={<AddMovie />} />
          <Route path='/movie/:movieId' element={<Movie />}/>
          </Route>
        </Route>

        <Route path={'/login'} element={<Login />} />
        <Route path='/signup'element={<SignUp />} /> 
      </Routes>
    </BrowserRouter>
    </RecoilRoot> 
    <Toaster position='top-center'/> 
    </div>
  )
}

export default App
