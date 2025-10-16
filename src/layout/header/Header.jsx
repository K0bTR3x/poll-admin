import React, { useState } from 'react'
import "./Header.scss"
import { CiDark, CiLight } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/slices/themeSlice/themeSlice';
const Header = () => {
    const dispatch = useDispatch()
    const darkMode = useSelector((state) => state.theme.darkMode)
    return (
        <header className="header">
            <div className="header-title">İdarəetmə Paneli</div>
            <div className="header-actions">
                <button onClick={() => {
                    dispatch(toggleTheme())
                }} className="theme-toggle">
                    {darkMode ? <CiLight /> : <CiDark />}
                </button>
            </div>
        </header>
    )
}

export default Header
