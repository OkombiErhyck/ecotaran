import "./footer2.css";

const Footer2 = () => {
    return (
        <>
           <div className="container py-5">
      <div className="row">
        <div className="col-6 offset-3 text-center py-5">
          <h1 className="font-weight-bold">Afla mai multe despre noi si afacerea noastra </h1>
           </div>
      </div>
      <br/><br/><br/><br/>
      <div className="row">
        <ul>
          <li>
            <a href="https://www.facebook.com/p/ECO-%C8%9A%C4%82RAN-100074634338731/?paipv=0&eav=AfZePIEDErZzZFk4TIji_bWHT6uhMNrLbyTT_-_5-NRZkRuZHZ88ouCTWHqZs34o344&_rdr">
              <i className="fa fa-facebook" aria-hidden="true"></i>
              <span> - Facebook</span>
            </a>
          </li>
          <li>
            <a href="https://www.tiktok.com/@eco.taran">
              <i className="fa fa-youtube" aria-hidden="true"></i>
              <span> - TikTok</span>
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/eco.taran/">
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