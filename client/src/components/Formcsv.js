import React, { Component, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import axios from 'axios';
import Progress from '../components/Progress';
import './Fontcsv.css'

export default function FormDialog(props) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState('');
    const [state, setState] = useState(false);
    const [fullWidth, setFullWidth] = useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onChange = async (e) => {
        setFile(e.currentTarget.files[0]);
    }

    async function uploadToShopifyCustomers(e) {
        var formData = new FormData();
        formData.append('file', file);
        console.log(formData);
        try {
            setState(true);
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

    async function uploadToShopifyProducts(e) {
        var formData = new FormData();
        formData.append('file', file);
        console.log(formData);
        try {
            setState(true);
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
        <div >
            <button className="importcsv" onClick={handleClickOpen}> import {props.data}</button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="dial-csv"
                fullWidth={fullWidth}
                maxWidth="lg"
            >
                <DialogTitle id="formtTitle">CSV file Upload</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Upload a csv file
                    </DialogContentText>
                    <Input
                        onChange={onChange}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="CSV File"
                        type="file"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        handleClose();
                    }} color="primary">
                        Cancel
                    </Button>
                    {props.data === "customers" ?
                        <Button onClick={() => {
                            // handleClose();
                            uploadToShopifyCustomers();
                        }} color="primary">
                            Upload Customers
                        </Button>
                        : ""}
                    {props.data === "products" ?
                        <Button onClick={() => {
                            // handleClose();
                            uploadToShopifyProducts();
                        }} color="primary">
                            Upload Products
                        </Button>
                        : ""
                    }
                    {state && <Progress />}
                </DialogActions>
            </Dialog>
        </div>
    );
}