import type React from "react";

import Footer from "../../Components/Footer/Footer";
import Posts from "../../Components/Posts/Posts";

const Home: React.FC = () => {
    return(
        <>
        <Posts />
        <Footer />
        </>
    );
}

export default Home;