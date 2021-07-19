import React, { useState } from 'react'
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import { Link } from 'react-router-dom';

function Products() {
  const [status, setstatus] = useState(null);

  //run on page reload useEffect()
  React.useEffect(() => {
    axios.get("/api/export/product").then((response) => {
      console.log(response);
      setstatus(response.data)

    })
  },[])

  // const getproducts = () => {
  //   axios.get("/api/export/product").then((response) => {
  //     console.log(response);
  //     setstatus(response.data)

  //   })
  // }

  const columns = [{
    dataField: 'id',
    text: 'Product ID'
  }, {
    dataField: 'title',
    text: 'Product Name'
  }, {
    dataField: 'body_html',
    text: 'Product html'
  }];

  return (
    <div className="products">
      <h1>Products</h1>
      <Link to='/addproduct' >
        <button>Add Product</button>
      </Link><br/>
      <Link to='/addproductscsv' >
        <button>Add Products by csv</button>
      </Link>
      {/* <button><Route exact path="/products" component={Products}></Route></button> */}
      {/* <button onClick = {getproducts}>Get Products</button> */}
      <BootstrapTable keyField='id' data={status == null ? [] : status.Data} columns={columns} />
    </div>
  )
}

export default Products
