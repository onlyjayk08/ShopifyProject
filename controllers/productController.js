const products = require('../model/productSchema');
const axios = require('axios');
const csvtojson = require('csvtojson');
const cache = require('memory-cache');

exports.exportProduct = async (req, res) => {
    const product = await products.find({}, { _id: 0, custom_collection: 0 });
    res.json({ Data: product })
}

exports.importdata = async (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ message: 'No File was Uploaded' });
    }
    const file = req.files.file;
    await uploadfile(file);
    await csvtodatabse(file);

    setTimeout(async function () {
        const product = await products.find({}, { _id: 0, custom_collection: 0 });
        await sendproductdata(product, 0);
    }, 1000);


}

exports.customCollection = async (req, res) => {
    const collection = await products.find({});
    await sendcustomCollection(collection, 0);
    res.send(`custom collection being added`)
}

exports.deleteallproduct = async (req, res) => {
    var config = {
        method: 'get',
        url: `https://${process.env.API_key}:${process.env.API_password}@${process.env.STORE_NAME}/admin/api/2021-04/products.json`,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    await axios(config).then(async (response) => {
        var data = response.data.products;
        await deleteAllProducts(data, 0);
    })
    res.send("Products being deleted");
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

async function deleteAllProducts(data, length) {

    if (data[length] == null) {
        return
    }
    var conimg = {
        method: 'delete',
        url: `https://${process.env.API_key}:${process.env.API_password}@${process.env.STORE_NAME}/admin/api/2021-04/products/${data[length].id}.json`,

    };
    await axios(conimg);
    console.log(`product ${data[length].title} deleted`);
    await products.findOneAndRemove({ title: `${data[length].title}` }, (error, deletedRecord) => {
        if (!error) {
            console.log(`${data[length].title} has been removed from database`)
        }
        else {
            console.log(error);
        }
    });
    deleteAllProducts(data, length + 1);
}

function uploadfile(file) {
    file.mv(`./uploads/${file.name}`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        //res.json({ fileName: file.name, filePath: `/uploads/${file.name}` })
    })
}

async function csvtodatabse(file) {
    csvtojson().fromFile(`./uploads/${file.name}`).then(async (json) => {
        await products.insertMany(json);

    })
    console.log(file.name)
}

async function sendproductdata(data, length) {
    if (length < data.length) {
        prog = 100 / (data.length * 2);
        const state = await products.findOne({ title: data[length].title })
        if (state.state === "complete") {
            console.log(`product ${data[length].title} already uploaded`)
        }
        else {
            var config = {
                method: 'post',
                url: `https://${process.env.API_key}:${process.env.API_password}@${process.env.STORE_NAME}/admin/api/2021-04/products.json`,
                data: {
                    "product": data[length]
                }
            };
            await axios(config)

            console.log("product " + data[length].title + " is added");
            if (prog * (length + 1) < 100) {
                cache.put("progress", prog * (length + 1));
            }
            await products.findOneAndUpdate({ title: data[length].title }, { $set: { state: "complete" } })
        }

        sendproductdata(data, length + 1);
    }
    else if (length === data.length) {
        await sendimage(data, 0);
    }
}

async function sendimage(data, length) {
    if (length < data.length) {
        prog = 100 / (data.length * 2);
        var conf = {
            method: 'get',
            url: `https://${process.env.API_key}:${process.env.API_password}@${process.env.STORE_NAME}/admin/api/2021-04/products.json`,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        await axios(conf).then(async (response) => {
            var pro = response.data.products;
            if (pro[length] != null) {
                const getimage = await products.findOne({ title: pro[length].title })
                var conimg = {
                    method: 'post',
                    url: `https://${process.env.API_key}:${process.env.API_password}@${process.env.STORE_NAME}/admin/api/2021-04/products/${pro[length].id}/images.json`,
                    data: {
                        "image": getimage.image
                    }
                };
                await axios(conimg)
                console.log(data.length)
                console.log(`image added to ${pro[length].title}`)
            }
            else {
                console.log(`title could not be found`);
            }
            if (prog * ((length + 1) + data.length) < 100) {
                cache.put("progress", prog * ((length + 1) + data.length));
            }
            else if (prog * (length + 1) == 100) {

                cache.put("progress", prog * ((length + 1) + data.length) - 1);
            }
        })
        sendimage(data, length + 1);
    }
    else {
        setTimeout(() => {
            var con = {
                method: 'get',
                url: `https://${process.env.API_key}:${process.env.API_password}@${process.env.STORE_NAME}/admin/api/2021-04/products.json`,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            axios(con).then(async (response) => {
                var datas = response.data.products;
                if (datas.length != 0) {
                    console.log(datas)
                    console.log("Complete")
                    cache.put("progress", 100);
                    return
                }
                else {
                    console.log("Data not displaying")
                    sendimage(data, length + 1);
                    console.log(`count ${length}`)
                }
            })
        }, 2000);
    }
}

async function sendcustomCollection(data, length) {
    console.log(data[length].custom_collection);
    if (length < data.length) {
        if (data[length].custom_collection.title != null) {
            var config = {
                method: 'post',
                url: `https://${process.env.API_key}:${process.env.API_password}@${process.env.STORE_NAME}/admin/api/2021-04/custom_collections.json`,
                data: {
                    "custom_collection": data[length].custom_collection
                }
            };
            await axios(config)
            console.log(`custom collection ${data[length].custom_collection.title} added`);
        }
        else {
            console.log(`title could not be found`);
        }
        sendcustomCollection(data, length + 1);

    }
}