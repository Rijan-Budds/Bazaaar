import type React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Head from "./Components/Header/Head"

const App: React.FC = () => {
  return(
    <BrowserRouter>
    <Head />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;