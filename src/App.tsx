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
