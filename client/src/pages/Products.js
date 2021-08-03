import React, { useState } from 'react'
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import './Products.css'
import Formcsv from '../components/Formcsv'

function Products() {
  const [status, setStatus] = useState(null);
  const [view, setView] = useState(true);

  const showView = () => {
    setView(!view);
    console.log(view);
  }

  //run on page reload useEffect()
  React.useEffect(() => {
    axios.get("/api/export/products").then((response) => {
      console.log(response);
      setStatus(response.data)

    })
  }, []);

  const columns = [{
    dataField: 'title',
    text: 'Product Name'
  }, {
    dataField: 'variant.price',
    text: 'Product Price'
  }, {
    dataField: 'status',
    text: 'Status'
  }, {
    dataField: 'tags',
    text: 'Tags'
  }, {
    dataField: 'vendor',
    text: 'Vendor'
  }];

  async function deleteAllProducts(e) {
    try {
      await axios.delete('/api/delete/products');
      setTimeout(async function () {
        await axios.get("/api/export/products").then((response) => {
          console.log(response);
          setStatus(response.data)
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
      <Formcsv data={"products"} />

      <span className={view ? "table-view-active" : "table-view"} onClick={showView}>Table</span>
      <span className={view ? "grid-view" : "grid-view-active"} onClick={showView}>Grid</span>

      {view ? <BootstrapTable keyField='title' data={status == null ? [] : status.Data} columns={columns} /> :
        <div className="row">
          {status !== null && status.Data.map((info) => {
            // console.log(info)
            return (
              <React.Fragment>
                <div className="col-md-3 card shadow">
                  <div className="grid">
                    <table>
                      <tr>
                        <td>
                          <span>
                            <img src={info.image.src} alt={info.title} />
                          </span>
                        </td>
                        <td>
                          <span>
                            Title: {info.title}
                          </span><br />
                          <span>
                            Price: ${info.variant.price}
                          </span><br />
                          <span>
                            Status: {info.status}
                          </span><br />
                          {/* <span>
                            Tags: {info.tags}
                          </span><br/> */}
                          <span>
                            Vendor: {info.vendor}
                          </span>
                        </td>
                      </tr>
                    </table>
                    {/* <span>
                      <img src={info.image.src} alt={info.title} />
                    </span><br /> */}

                    {/* <span>
                      Title: {info.title}
                    </span><br />
                    <span>
                      Price: ${info.variant.price}
                    </span><br />
                    <span>
                      Status: {info.status}
                    </span> */}
                  </div>
                </div>
              </React.Fragment>
            )
          })}
        </div>
      }
    </div>
  )
}

export default Products
