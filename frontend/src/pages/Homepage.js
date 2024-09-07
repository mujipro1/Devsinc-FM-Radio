import './Homepage.css'
import Navbar from '../components/Navbar';
import SearchComponent from '../components/Search';


const Homepage = () => {
    return (
        <>
        <Navbar/>
        <SearchComponent className="search"/>
        </>
    )
}

export default Homepage;