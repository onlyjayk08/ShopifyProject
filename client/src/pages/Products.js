import React, { useState } from 'react'
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import './Products.css'
import Formcsv from '../components/Formcsv'

function Products() {
  const [status, setstatus] = useState(null);

  //run on page reload useEffect()
  React.useEffect(() => {
    axios.get("/api/export/products").then((response) => {
      console.log(response);
      setstatus(response.data)

    })
  },[]);

  const columns = [{
    dataField: 'title',
    text: 'Product Name'
  }, {
    dataField: 'variant.price',
    text: 'Product Price'
  }, {
    dataField: 'body_html',
    text: 'Product html'
  }];

  async function deleteAllProducts(e) {
    try {
        await axios.delete('/api/delete/products');
        setTimeout(async function () {
            await axios.get("/api/export/products").then((response) => {
                console.log(response);
                setstatus(response.data)
            })
        }, 5000);

    }
    catch (err) {
        console.log(err);
    }

}

  return (
    <div className="products">
      <h1>Products</h1>
      <button onClick={deleteAllProducts} className="deleteAllProducts">Delete all Products</button>
      <Formcsv data={"products"}/>
      <BootstrapTable keyField='title' data={status == null ? [] : status.Data} columns={columns} />
      <div className="row">
        {status !== null && status.Data.map((info) =>{
          return(
            <React.Fragment>
              <div className="col-md-3 card shadow">
                <span>
                  {info.title}
                </span>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default Products
