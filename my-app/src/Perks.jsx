import "./perks.css";



export default function Perks({selected,onChange}) {

  function handleCbClick(ev) {
    const {checked,name} = ev.target;
    if (checked) {
     onChange([...selected,name]);
   
    } else {
     onChange([...selected.filter(selectedName => selectedName !== name)]);
   
   
    }
   }


    return(
        <>
          <div className="optiuni">
          <div>
            <label>
              <input type="checkbox"  checked={selected.includes("De post")} name="De post" onChange={handleCbClick}/>
              <span>De post</span>
            </label>
          </div>   

          
          <div>
  <label>
    <input type="checkbox" checked={selected.includes("Eco")} name="Eco" onChange={handleCbClick}/>
    <span>Eco</span>
  </label>
</div>
<div>
  <label>
    <input type="checkbox" checked={selected.includes("proaspat")} name="proaspat" onChange={handleCbClick}/>
    <span>proaspat</span>
  </label>
</div>
<div>
  <label>
    <input type="checkbox" checked={selected.includes("ambalat")} name="ambalat" onChange={handleCbClick}/>
    <span>ambalat</span>
  </label>
</div>
<div>
  
</div>
        </div>
        </>
    );
};