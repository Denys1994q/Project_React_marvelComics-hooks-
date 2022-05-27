import './appHeader.scss';

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import {Link, NavLink} from 'react-router-dom';
// таке посилання веде на таку-от адресу (to), а вже далі за цією адресою показується той чи інший компонент

const AppHeader = () => {
    const location = useLocation();
    const [activeClass, setActiveClass] = useState(true);
    
    useEffect(() => {
        if (location.pathname !== '/') {
            setActiveClass(false)
        } else {
            setActiveClass(true)
        }
    }, [location])
    
    return (
        <header className="app__header">
            <h1 className="app__title">
                <Link to="/">
                    <span>Marvel</span> information portal
                </Link>
            </h1>
            <nav className="app__menu">
                <ul>
                    <li className={activeClass ? 'activeNav' : null} ><NavLink                   
                    style={({isActive}) => ({color: isActive ? '#9f0013' : 'inherit'})}
                    to="/characters">Characters
                    </NavLink></li>
                    /
                    <li><NavLink 
                    style={({isActive}) => ({color: isActive ? '#9f0013' : 'inherit'})} 
                    to="/comics">Comics
                    </NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;