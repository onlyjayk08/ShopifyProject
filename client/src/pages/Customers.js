import React, { useState } from 'react'
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import { Link } from 'react-router-dom';

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

    return (
        <div className="customers">
            <h1>Customers</h1>
            <Link to='/addcustomer' >
                <button>Add Customer</button>
            </Link><br />
            <Link to='/addcustomerscsv' >
                <button>Add Customer by csv</button>
            </Link>
            <BootstrapTable keyField='id' data={status == null ? [] : status.Data} columns={columns} />
        </div>
    )
}

export default Customers
