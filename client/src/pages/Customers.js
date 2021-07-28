import React, { useState } from 'react'
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import { Link } from 'react-router-dom';
import './Customers.css'
import Formcsv from '../components/Formcsv'

function Customers() {
    const [status, setstatus] = useState(null);

    React.useEffect(() => {
        axios.get("/api/export/customers").then((response) => {
            console.log(response);
            setstatus(response.data)

        })
    }, [])

    const columns = [
        {
            dataField: 'first_name',
            text: 'First Name'
        },
        {
            dataField: 'last_name',
            text: 'Last Name'
        },
        {
            dataField: 'email',
            text: 'Email'
        },
        {
            dataField: 'phone',
            text: 'Phone'
        }
    ];

    async function deleteAllCustomers(e) {
        e.preventDefault();
        try {
            await axios.delete('/api/delete/customers');
            setTimeout(async function () {
                await axios.get("/api/export/customers").then((response) => {
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
        <div className="customers">
            <h1>Customers</h1>
            <Formcsv data={"customers"} />
            <button onClick={deleteAllCustomers} className="deleteAllCustomers">Delete all Customers</button>
            <BootstrapTable keyField='id' data={status == null ? [] : status.Data} columns={columns} />
        </div >
    )
}

export default Customers
