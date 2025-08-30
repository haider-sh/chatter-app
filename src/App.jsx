import { Outlet } from 'react-router-dom';
import './App.css'
import Sidebar from './components/Sidebar';
import { useEffect, useState } from 'react';

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  function setTheme() {
    setDark(!dark);
  }

  return (
    <div className='flex w-full h-screen'>
      <Sidebar theme={dark} setTheme={setTheme} />
      <Outlet />
    </div>
  )
}

export default App;