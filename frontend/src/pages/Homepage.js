import './Homepage.css'
import Navbar from '../components/Navbar';
import SearchComponent from '../components/Search';


const Homepage = () => {
    return (
        <>
        <Navbar/>
        <SearchComponent className="search"/>
        <div className="row">
            <div className="col-md-6 d-flex flex-column align-items-center justify-content-center">
                <h1>Welcome to Ticketer</h1>
                <div >Your all in one Ticketing Solution!!</div>
            </div>
            <div className="col-md-6">
                <img src="images/homepage.webp" alt="homepage" className="homepage-image img-fluid p-5"/>
            </div>
        </div>
        </>
    )
}

export default Homepage;