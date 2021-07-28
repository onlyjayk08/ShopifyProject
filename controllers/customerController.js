const axios = require('axios');
const customers = require('../model/customerSchema');
const csvtojson = require('csvtojson');
const cache = require('memory-cache');

exports.exportCustomers = async (req, res) => {
    const customer = await customers.find({}, { _id: 0, "addresses._id": 0 });
    res.json({ Data: customer });
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

exports.uploadtodatabase = async (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ message: 'No File was Uploaded' });
    }
    const file = req.files.file;
    await uploadfile(file);
    await csvtodatabse(file);
    res.send("customers sent to database");
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
        await sendcustomerdata(customer, 0, res);
    }, 1000);
    res.send('sending customer data')
}

exports.deleteallcustomers = async (req, res) => {
    var config = {
        method: 'get',
        url: `https://${process.env.API_key}:${process.env.API_password}@${process.env.STORE_NAME}/admin/api/2021-04/customers.json`,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    setTimeout(() => {
        axios(config).then(async (response) => {
            var data = response.data.customers;
            console.log(data);
            await deleteAllCustomers(data, 0);
        })
    }, 2000);

    res.send("Customers being deleted");
}

exports.setProgress = (req, res) => {
    if (cache.get("progress") == 100) {
        res.json({
            progress: cache.get("progress")
        })
        cache.put("progress", 0);
        return
    }
    cache.get("progress");
    res.json({
        progress: cache.get("progress")
    })
}

async function deleteAllCustomers(data, length) {

    if (data[length] == null) {
        return
    }
    var conimg = {
        method: 'delete',
        url: `https://${process.env.API_key}:${process.env.API_password}@${process.env.STORE_NAME}/admin/api/2021-04/customers/${data[length].id}.json`,

    };
    await axios(conimg)
    console.log(`customer ${data[length].email} deleted`)
    await customers.findOneAndRemove({ email: `${data[length].email}` }, (error, deletedRecord) => {
        if (!error) {
            console.log(`${data[length].email} has been removed from database`)
        }
        else {
            console.log(error);
        }
    })
    deleteAllCustomers(data, length + 1);
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

async function sendcustomerdata(data, length, res) {
    if (length < data.length) {
        const state = await customers.findOne({ email: data[length].email });
        if (state.state === "complete") {
            console.log(`customer ${data[length].email} already uploaded`)
        }
        else {
            // console.log(data[length]);
            var config = {
                method: 'post',
                url: `https://${process.env.API_key}:${process.env.API_password}@${process.env.STORE_NAME}/admin/api/2021-04/customers.json`,
                data: {
                    "customer": data[length]
                }
            };
            await axios(config)
            console.log("customer " + data[length].email + " is added");
            prog = 100 / data.length;
            if (prog * (length + 1) < 100) {
                cache.put("progress", prog * (length + 1));
            }
            else if (prog * (length + 1) == 100) {

                cache.put("progress", prog * (length + 1) - 1);
            }

            console.log("Progress: " + cache.get("progress"));
            await customers.findOneAndUpdate({ email: data[length].email }, { $set: { state: "complete" } });
        }
        sendcustomerdata(data, length + 1);
    }
    else {
        setTimeout(() => {
            var con = {
                method: 'get',
                url: `https://${process.env.API_key}:${process.env.API_password}@${process.env.STORE_NAME}/admin/api/2021-04/customers.json`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            axios(con).then(async (response) => {
                var datas = response.data.customers;
                if (datas.length != 0) {
                    console.log(datas)
                    console.log("Complete")
                    cache.put("progress", 100);
                    return
                }
                else {
                    console.log("Data not displaying")
                    sendcustomerdata(data, length + 1);
                    console.log(`count ${length}`)
                }
            })
        }, 2000);
    }
}