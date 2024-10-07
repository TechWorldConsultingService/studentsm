import "./App.css";
import NavBar from "./components/navBar";
import Sidebar from "./components/sidebar";
import HomePage from "./pages/homePage";

function App() {
  return (
    <div className=" flex h-screen	w-screen	">
      <Sidebar />
      <div className="w-full">
      <NavBar />
      <HomePage />
      </div>
 
    </div>
  );
}

export default App;
