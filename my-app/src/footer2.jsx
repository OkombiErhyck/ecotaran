import "./footer2.css";

const Footer2 = () => {
    return (
        <>
           <div className="container py-5">
      <div className="row">
        <div className="col-6 offset-3 text-center py-5">
          <h1 className="font-weight-bold">Afla mai multe despre mine si afacerea mea </h1>
           </div>
      </div>
      <br/><br/><br/><br/>
      <div className="row">
        <ul>
          <li>
            <a href="#">
              <i className="fa fa-facebook" aria-hidden="true"></i>
              <span> - Facebook</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-youtube" aria-hidden="true"></i>
              <span> - YouTube</span>
            </a>
          </li>
          <li>
            <a href="">
              <i className="fa fa-instagram" aria-hidden="true"></i>
              <span> - Instagram</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
        </>
    );
};
export default Footer2;