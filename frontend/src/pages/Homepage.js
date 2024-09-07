import './Homepage.css'
import Navbar from '../components/Navbar';
import SearchComponent from '../components/Search';


const Homepage = () => {
    return (
        <>
        <Navbar/>
        <SearchComponent/>
        <h1>Homepage</h1>
        </>
    )
}

export default Homepage;