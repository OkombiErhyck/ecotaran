export default function Details() {
    const [places, setPlaces] = useState([]);
  
    useEffect(() => {
      const fetchData = () => {
        axios.get("/places").then(response => { 
          setPlaces(response.data);
        });
      };
      fetchData(); // Fetch data initially
      const intervalId = setInterval(fetchData, 10 * 60 * 1000); // Fetch data every 10 minutes
      return () => clearInterval(intervalId); // Cleanup function to clear the interval
    }, []);
  
    const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get('/places').then(response => {
      const sortedPlaces = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setPlaces(sortedPlaces);
      setLoading(false); // Set loading to false when the data is fetched
    });
  }, []);
    const filteredPlaces = places.filter(place => place.marca === 'fructe'); // filter places with "legume" marca
  
    return(
      <div className="main2"> 
        <div className="container">
        {loading ? (
          <div className="loader">
        <div className="spinner"> </div>
        <span className="loading-text">EcoTaran</span>
      </div>
       ) : (
          <div className="details container">
            <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredPlaces.length > 0 && filteredPlaces.map(place => ( 
                <Link to={"/place/" + place._id} key={place._id} className="link-no-underline" >
                  <div className="col ">
                    <div className="box card-body p-0 shadow-sm mb-5">
                      {place.photos.length > 0 && (
                        <Image src={place.photos[0]} className="img-fluid" style={{height: "270px", width: "100%", objectFit: "cover"}}/>
                      )}
                      <div className="box_content">
                        <h4>{place.title}</h4>
                        <div className="row pl-2 pr-2">
                          <div>{place.putere}</div>
                          <button style={{background : "#cccccc00", color : "var(--main)"}} className="btn1">Detalii</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
       )}
        </div>
      </div>
    );
  };
  