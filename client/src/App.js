import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'; 
import Home from './pages/Home';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';

function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Switch>
          <Route path='/' exact component={Home}></Route>
          <Route path='/customers' component={Customers}></Route>
          <Route path='/products' component={Products}></Route>
          <Route path='/orders' component={Orders}></Route>
        </Switch>
      </Router> 

    </>
  );
}

export default App;
