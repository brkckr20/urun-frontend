import 'bootstrap/dist/css/bootstrap.min.css'

import axios from 'axios';
import React, { useEffect, useState } from 'react';


function App() {

  const [liste, setListe] = useState([]);

  const [tarih, setTarih] = useState(new Date());
  const [miktar, setMiktar] = useState(null);
  const [birim_fiyat, setBirim_fiyat] = useState(null);

  const [tutar, setTutar] = useState();

  const [loading, setLoading] = useState(false);

  const [yenile, setYenile] = useState("evet");



  useEffect(() => {
    axios.get("https://urun-backend.onrender.com/listele").then(data => {
      setLoading(true)
      setListe(data?.data.data);
      setTutar(data?.data.toplam);
      setLoading(false)
    }).catch(err => {
      console.log(err)
      setLoading(false)
    });
  }, [yenile]);


  async function kaydet(e) {
    e.preventDefault();
    const data = await axios.post("https://urun-backend.onrender.com/ekle", { tarih, miktar, birim_fiyat })
    live();
  }

  async function sil(id) {
    const data = await axios.delete(`https://urun-backend.onrender.com/sil/${id}`);
    live();
  }

  function live() {
    setYenile(prev => prev === "evet" ? "hayir" : "evet");
  }

  return (
    <div className='bg-dark h-100 '>
      <div className='container-fluid'>
        <div className="row pt-3">
          <div className="col-lg-6 col-12 mb-4">
            <form onSubmit={kaydet}>
              <div className="mb-3">
                <label className="form-label text-white">Tarih</label>
                <input type="date" className="form-control" value={tarih || ""} onChange={e => setTarih(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label text-white" >Miktar</label>
                <input type="number" step="0.01" value={miktar || ""} onChange={e => setMiktar(e.target.value)} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label text-white">Birim Fiyat</label>
                <input type="number" step="0.01" className="form-control" value={birim_fiyat || ""} onChange={e => setBirim_fiyat(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary w-100">Kaydet</button>
            </form>
          </div>
          <div className="col-lg-6 col-12">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th scope="col">Tarih</th>
                  <th scope="col">Miktar</th>
                  <th scope="col">Br.Fiyat</th>
                  <th scope="col">Tutar</th>
                  <th scope="col" className='text-center'>Sil</th>
                </tr>
              </thead>
              <tbody>
                {loading ? <div className='text-white'>Yükleniyor</div> : (
                  liste.map(item => (
                    <tr key={item.id}>
                      <th>{formatTarih(item.tarih)}</th>
                      <td>{item.miktar}</td>
                      <td>{formatter.format(item.birim_fiyat)}</td>
                      <td>{formatter.format(item.tutar)}</td>
                      <td className='text-center'><button onClick={() => sil(item.id)} type="button" className="btn btn-danger">Sil</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {
                !loading ? (
                  <tfoot>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>Toplam</td>
                      <td className='text-success'>{formatter.format(tutar || 0)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                ) : null
              }

            </table>
          </div>
        </div>

      </div>
    </div>
  )
}



export default App

const formatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
});


function formatTarih(tarih) {
  const [yil, ay, gun] = tarih.split('-');
  return `${gun}.${ay}.${yil}`;
}
