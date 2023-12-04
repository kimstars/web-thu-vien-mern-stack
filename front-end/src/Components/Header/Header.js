import { React, useState, useRef, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import './Header.css';
import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';
import { FaSearch } from "react-icons/fa";
import { AuthContext } from "../../Context/AuthContext.js"
import {  useHistory } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function Header() {

    const [menutoggle, setMenutoggle] = useState(false)
    const history = useHistory();

    const Toggle = () => {
        setMenutoggle(!menutoggle)
    }

    const closeMenu = () => {
        setMenutoggle(false)
    }

    const { user } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState("");


    const handleSearch = (event) => {
        event.preventDefault();
        // Gửi yêu cầu tìm kiếm
        console.log("Từ khóa tìm kiếm:", searchTerm);

        history.push(`/search/${searchTerm}`);

      };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
          handleSearch(event);
        }
      };


    return (
        <div className="header">
            <div className="logo-nav">
                <Link to="/">
                    <a href="#home">THƯ VIỆN MTA </a>
                </Link>
            </div>
            <div className="nav-right">

                <div className="search-container">
                    <input className="search-input" type="text" placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onKeyUp={handleKeyPress}

                    />

                </div>


                <ul className={menutoggle ? "nav-options active" : "nav-options"}>
                    <li className="option" onClick={() => { closeMenu() }}>
                        <Link to="/">
                            <a href="#home">Trang chủ</a>
                        </Link>
                    </li>
                    <li className="option" onClick={() => { closeMenu() }}>
                        <Link to="/books">
                            <a href="#books">Kho sách</a>
                        </Link>
                    </li>

                    {!user ? (
                        <>
                            <li className="option" onClick={() => { closeMenu() }}>
                                <Link to="/signin">
                                    <a href="signin">Đăng nhập</a>
                                </Link>
                            </li>

                            <li className="option" onClick={() => { closeMenu() }}>
                                <Link to="/signup">
                                    <a href="signup">Đăng ký</a>
                                </Link>
                            </li>


                        </>
                    ) : (
                        <>
                            <li className="option" onClick={() => { closeMenu() }}>
                                <Link to="/signin">
                                    <a href="signin">Admin</a>
                                </Link>
                            </li>
                            <li className="option" onClick={() => { closeMenu() }}>
                                <Link to="/cart">
                                    <div className="nav-bag">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="35"
                                            height="35"
                                            fill="currentColor"
                                            className="bi bi-handbag-fill"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M8 1a2 2 0 0 0-2 2v2H5V3a3 3 0 1 1 6 0v2h-1V3a2 2 0 0 0-2-2zM5 5H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5H11v1.5a.5.5 0 0 1-1 0V5H6v1.5a.5.5 0 0 1-1 0V5z" />
                                        </svg>
                                        <span className="bag-quantity">
                                            <span>2</span>
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        </>
                    )}

                </ul>
            </div>
            <div className="mobile-menu" onClick={() => { Toggle() }}>
                {menutoggle ? (
                    <ClearIcon className="menu-icon" style={{ fontSize: 40 }} />
                ) : (
                    <MenuIcon className="menu-icon" style={{ fontSize: 40 }} />
                )}
            </div>

        </div>




    )
}

export default Header
