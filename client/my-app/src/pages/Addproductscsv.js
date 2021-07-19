import React, { useState } from 'react';
import axios from 'axios';

export default function Addproductscsv() {

    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState();

    const onChange = async (e) => {
        setFile(e.currentTarget.files[0]);
        setFilename(e.target.files[0].name);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        var formData = new FormData();
        formData.append('file', file);
        // formData.append('fileName', filename);

        console.log(formData);
        // console.log(file);

        try {
            const res = await axios.post('/api/uploadcsv', formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                },
            });
            const { fileName, filePath } = res.data;
            setUploadedFile({ fileName, filePath });

        } catch (err) {
            if (err.response.status === 500) {
                console.log('There was a problem with the server');
            }
            else {
                console.log(err.response.data.message);
            }
        }
    }

    async function uploadToDatabase() {
        var formData = new FormData();
        formData.append('file', file);
        console.log(formData);
        await axios.post('/api/import/productcsv', formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
    }

    async function uploadToShopify(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append('file', file);
        console.log(formData);
        try {
            await axios.post('/api/datatoproj', formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });
        }
        catch (err) {
            console.log(err);
        }

    }

    return (
        <div>
            <h1>Add Product by csv Page</h1>
            <form onSubmit={onSubmit}>
                <input type="file" className="customeFile" onChange={onChange} />
                <input type="submit" />
            </form>
            <button onClick={uploadToDatabase}>upload to database</button><br />
            <button onClick={uploadToShopify}> upload to shopify</button>


        </div>
    )
}
