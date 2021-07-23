import React, { useState } from 'react';
import axios from 'axios';
import Progress from '../components/Progress';

function AddCustomersCSV() {
    const [file, setFile] = useState('');

    const onChange = async (e) => {
        setFile(e.currentTarget.files[0]);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        var formData = new FormData();
        formData.append('file', file);
        console.log(formData);

        try {
            const res = await axios.post('/api/uploadcustomercsv', formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                },
            });

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
        await axios.post('/api/import/customercsv', formData, {
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
            await axios.post('/api/import/customerdata', formData, {
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
            <h1>Add Customer by CSV</h1>
            <form onSubmit={onSubmit}>
                <input type="file" className="customeFile" onChange={onChange} />
                <input type="submit" />
            </form>
            <button onClick={uploadToDatabase}>upload to database</button><br />
            <button onClick={uploadToShopify}> upload to shopify</button><br />
            <div className="progress">
                <Progress />
            </div>

        </div>
    )
}

export default AddCustomersCSV
