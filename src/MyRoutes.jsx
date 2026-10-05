import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Layout from './component/Layout'

const MyRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<Homepage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default MyRoutes