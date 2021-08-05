import React, { useState } from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css'

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

        </>

    )
}

export default Navbar
