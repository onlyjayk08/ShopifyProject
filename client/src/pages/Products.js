import React, { useState } from 'react'
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import './Products.css'
import Formcsv from '../components/Formcsv'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
  root: {
    // maxWidth: 135,
  },
  media: {
    height: 200,
  },
});

function Products() {
  const [status, setStatus] = useState(null);
  const [view, setView] = useState(true);

  const showView = () => {
    setView(!view);
    console.log(view);
  }

  //run on page reload useEffect()
  React.useEffect(() => {
    axios.get("/api/export/products").then((response) => {
      console.log(response);
      setStatus(response.data)

    })
  }, []);

  const columns = [{
    dataField: 'title',
    text: 'Product Name'
  }, {
    dataField: 'variant.price',
    text: 'Product Price'
  }, {
    dataField: 'status',
    text: 'Status'
  }, {
    dataField: 'tags',
    text: 'Tags'
  }, {
    dataField: 'vendor',
    text: 'Vendor'
  }];

  async function deleteAllProducts(e) {


    try {
      await axios.delete('/api/delete/products');
      setTimeout(async function () {
        await axios.get("/api/export/products").then((response) => {
          console.log(response);
          setStatus(response.data)
        })
      }, 5000);

    }
    catch (err) {
      console.log(err);
    }

  }

  const classes = useStyles();

  return (
    <div className="products">
      <h1>Products</h1>
      <button onClick={deleteAllProducts} className="deleteAllProducts">Delete all Products</button>
      <Formcsv data={"products"} />

      <span className={view ? "table-view-active" : "table-view"} onClick={showView}>Table</span>
      <span className={view ? "grid-view" : "grid-view-active"} onClick={showView}>Grid</span>

      {view ? <BootstrapTable keyField='title' data={status == null ? [] : status.Data} columns={columns} /> :
        <div className="container-fluid">
          <div className="row mt-5">
            {status !== null && status.Data.map((info) => {
              // console.log(info)
              return (
                <React.Fragment>
                  <div className="col-md-3 shadow">
                    {/* <table>
                      <tr>
                        <td>
                          <span>
                            <img src={info.image.src} alt={info.title} />
                          </span>
                        </td>
                        <td>
                          <span>
                            Title: {info.title}
                          </span><br />
                          <span>
                            Price: ${info.variant.price}
                          </span><br />
                          <span>
                            Status: {info.status}
                          </span><br />
                          <span>
                            Vendor: {info.vendor}
                          </span>
                        </td>
                      </tr>
                    </table> */}
                    <Card className={classes.root}>
                      <CardActionArea>
                        <CardMedia
                          className={classes.media}
                          image={info.image.src}
                          // image="/static/images/cards/contemplative-reptile.jpg"
                          title="Contemplative Reptile"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            Title: {info.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="p">
                            Price: ${info.variant.price}
                            <br />
                            Status: {info.status}
                            <br />
                            Vendor: {info.vendor}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        <Button size="small" color="primary">
                          Share
                        </Button>
                        <Button size="small" color="primary">
                          Learn More
                        </Button>
                      </CardActions>
                    </Card>
                    {/* <span>
                    <img src={info.image.src} alt={info.title} />
                  </span><br />
                  <span>
                    Title: {info.title}
                  </span><br />
                  <span>
                    Price: ${info.variant.price}
                  </span><br />
                  <span>
                    Status: {info.status}
                  </span><br />
                  <span>
                    Vendor: {info.vendor}
                  </span> */}
                  </div>
                </React.Fragment>
              )
            })}
          </div>
        </div>
      }
      {/* <div class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <a href="#" class="card-link">Card link</a>
          <a href="#" class="card-link">Another link</a>
        </div>
      </div> */}
    </div>
  )
}

export default Products
