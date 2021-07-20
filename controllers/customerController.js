const axios = require('axios');
const customers = require('../model/customerSchema');
const csvtojson = require('csvtojson');

exports.exportCustomers = (req, res) => {
    // var config = {
    //     method: 'get',
    //     url: `https://${process.env.API_key}:${process.env.API_password}@${process.env.STORE_NAME}/admin/api/2021-04/customers.json`,
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // };

    // axios(config)
    //     .then(function (response) {
    //         var data = response.data.customers;
    //         res.json({ Data: data })
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });

    const customer = await customers.find({}, { _id: 0, "addresses._id": 0 });

    res.json({Data: data})
}

exports.uploadcustomercsv = (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ message: 'No File was Uploaded' });
    }
    const file = req.files.file;
    file.mv(`./uploads/${file.name}`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.json({ fileName: file.name, filePath: `/uploads/${file.name}` })
    })
}

exports.uploadtodatabase = async (req, res) =>{
    if (req.files === null) {
        return res.status(400).json({ message: 'No File was Uploaded' });
    }
    const file = req.files.file;
    await uploadfile(file);
    await csvtodatabse(file);
    res.send("products sent to database");
}

exports.importCustomerData = async (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ message: 'No File was Uploaded' });
    }
    const file = req.files.file;
    await uploadfile(file);
    await csvtodatabse(file);

    setTimeout(async function () {
        const customer = await customers.find({}, { _id: 0, "addresses._id": 0 });
        await sendcustomerdata(customer, 0);
    }, 1000);
    res.send('sending customer data')
}

function uploadfile(file) {
    file.mv(`./uploads/${file.name}`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
    })
}

async function csvtodatabse(file) {
    csvtojson().fromFile(`./uploads/${file.name}`).then(async (json) => {
        await customers.insertMany(json);

    })
    console.log(file.name)
}

async function sendcustomerdata (data, length){
    if(length < data.length){
        const state = await customers.findOne({email: data[length].email});
        if  (state.state === "complete"){
            console.log(`customer ${data[length].email} already uploaded`)
        }
        else{
            // console.log(data[length]);
            var config = {
                method: 'post',
                url: `https://${process.env.API_key}:${process.env.API_password}@${process.env.STORE_NAME}/admin/api/2021-04/customers.json`,
                data:{
                    "customer": data[length]
                }
            };
            await axios(config)
            
            console.log("customer " + data[length].email + " is added" );
            await customers.findOneAndUpdate({email: data[length].email}, {$set:{state: "complete"}})
        }
        sendcustomerdata(data, length + 1);
    }
}