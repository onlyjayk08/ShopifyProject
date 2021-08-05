import React, { useState } from 'react'
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import './Customers.css'
import Formcsv from '../components/Formcsv'

function Customers() {
    const [status, setstatus] = useState(null);
    const [view, setView] = useState(true);

    const showView = () => {
        setView(!view);
        console.log(view);
    }

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
            <button onClick={deleteAllCustomers} className="deleteAllCustomers">Delete all Customers</button>
            <Formcsv data={"customers"} />

            <span className={view ? "table-view-active" : "table-view"} onClick={showView}>Table</span>
            <span className={view ? "grid-view" : "grid-view-active"} onClick={showView}>Grid</span>

            {view ? <BootstrapTable keyField='id' data={status == null ? [] : status.Data} columns={columns} /> :
                ""
            }
        </div >
    )
}

export default Customers
