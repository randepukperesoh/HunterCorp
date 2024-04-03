import './App.css'
import { BilliadrdCanvas } from './components/BilliadrdCanvas/BilliadrdCanvas'

export interface SettingsInterface {
  width: number;
  height: number;
  speed: number;
}

function App() {
  const settings : SettingsInterface = {
    width: 500,
    height: 800,
    speed: 10,
  }

  return (
    <>
    <BilliadrdCanvas settings={settings}/>
    </>
  )
}

export default App

// 1. Create a TXT record in your DNS configuration for the following hostname: _github-pages-challenge-randepukperesoh.huntercorptest.co 
// 2. Use this code for the value of the TXT record: f909e375e544a0dffbad1fb4709bac 3. Wait until your DNS configuration changes. This could take up to 24 hours to propagate.