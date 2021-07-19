import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'; 
import Home from './pages/Home';
import Customers from './pages/Customers';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import AddProductscsv from './pages/Addproductscsv';
import Orders from './pages/Orders';
import AddCustomer from './pages/AddCustomer';
import AddCustomersCSV from './pages/AddCustomersCSV';

function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Switch>
          <Route path='/' exact component={Home}></Route>
          <Route path='/customers' component={Customers}></Route>
          <Route path='/products' component={Products}></Route>
          <Route path='/addproduct' component={AddProduct}></Route>
          <Route path='/addproductscsv' component={AddProductscsv}></Route>
          <Route path='/orders' component={Orders}></Route>
          <Route path='/addcustomer' component={AddCustomer}></Route>
          <Route path='/addcustomerscsv' component={AddCustomersCSV}></Route>
        </Switch>
      </Router> 

    </>
  );
}

export default App;
