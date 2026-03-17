import React from 'react'
import Landingpage from './common/Landingpage'
import Aboutpage from './common/Aboutpage'
import{BrowserRouter as Router , Routes,Route} from "react-router-dom"
import ArchivePage from './common/Archivepage'
function App() {
  return (
    <div>
     <Router>
      <Routes>
        <Route path='/' element={<Landingpage/>}/>
        <Route path='/about' element={<Aboutpage/>}/>
          <Route path='/archive' element={<ArchivePage/>}/>

      </Routes>
     </Router>
    </div>
  )
}

export default App
