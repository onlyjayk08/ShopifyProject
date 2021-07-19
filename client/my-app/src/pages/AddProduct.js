import React, { useState } from 'react'
import axios from 'axios'

function AddProduct() {

    const [title, setTitle] = useState('');
    const [vendor, setVendor] = useState('');
    const [productType, setProductType] = useState('');
    const [tags, setTags] = useState('');

    const productdata = {
        title: title,
        vendor: vendor,
        product_type: productType,
        tags: [tags],
    }

    const sendProduct = () =>{
        axios.post("/api/export/addproduct", {productdata: productdata}).then((response) =>{
           console.log(response); 
        })
    }

    return (
        <div>
            <h1>Add product Page</h1>
            <div className="addproduct">
                <input type="text" placeholder="Title" onChange={(e) => {
                    setTitle(e.target.value);
                }} /><br />
                <input type="text" placeholder="vendor" onChange={(e) => {
                    setVendor(e.target.value);
                }} /><br />
                <input type="text" placeholder="Product_type" onChange={(e) => {
                    setProductType(e.target.value);
                }} /><br />
                <input type="text" placeholder="tags" onChange={(e) => {
                    setTags(e.target.value);
                }}/><br />
                <button onClick= {sendProduct}>Add product</button>
            </div>

        </div>
    )

}

export default AddProduct;
