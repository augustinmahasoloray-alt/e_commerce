import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1"></main>
      <Footer />
    </div>
  )
}

export default App