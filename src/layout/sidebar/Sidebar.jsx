import React from 'react'
import logo from "../../assets/images/logo.png";
import { BsFillQuestionSquareFill } from "react-icons/bs";
import { MdEvent } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { IoIosExit } from "react-icons/io";
import { Link } from 'react-router';
import { MdAdminPanelSettings } from "react-icons/md";
import "./Sidebar.scss"
const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <img width={"60%"} src={logo} alt="" />
            </div>
            <ul className="sidebar-menu">
                <li className="active"><Link to='/dashboard'>İdarəetmə Paneli <MdAdminPanelSettings /></Link></li>
                <li ><Link to="/events">Tədbirlər <MdEvent /></Link></li>
                <li><Link>Suallar <BsFillQuestionSquareFill /></Link></li>
                <li><Link>İstifadəçilər <FaUsers /></Link></li>
                <li><Link>Çıxış <IoIosExit /></Link></li>
            </ul>
        </aside>
    )
}

export default Sidebar
