import React, { useState } from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css'
import { IconContext } from 'react-icons';

function Navbar() {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => {
        setSidebar(!sidebar);
    }

    function navbar(sidebarstate) {
        if (!sidebarstate) {
            return (
                <Link to="#" className='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar} />
                </Link>
            )
        }
        else if (sidebarstate) {
            return (
                <Link to="#" className="menu-bars">
                    <AiIcons.AiOutlineClose onClick={showSidebar} />
                </Link>
            )
        }
    }

    return (
        <>
            {/* <IconContext.Provider value={{color: '#fff'}}>
            <div className="navbar">
                <Link to="#" className='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar}/>
                </Link>
            </div> */}
            {/* <IconContext.Provider value={{ color: '#1a83ff' }}> */}
            <nav className="NavbarItems">
                <Link to="/">
                    <h1 className="navbar-logo">Shopify Application</h1>
                </Link>
                <div className="menu-icon">
                    {navbar(sidebar)}
                </div>
                <ul className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    {SidebarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span onClick={showSidebar}>{item.title}</span>
                                </Link>

                            </li>
                        )
                    })}
                </ul>
            </nav>
            {/* </IconContext.Provider> */}
        </>

    )
}

export default Navbar
