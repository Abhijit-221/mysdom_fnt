import React, { useContext, useEffect, useState } from 'react'
import ServiceGrid from '../ServiceGrid';
import axiosInstance from '../../api/axiosInstance';
import './product.css'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowBigDownIcon, ArrowBigRight, ChevronsRight, ClipboardList, ScreenShare, ShieldCheck, Users } from 'lucide-react';

function Product() {
    let products = [
        {
            id: 1,
            name: "Employment check",
            description: "Comprehensive checks to ensure trust and reliability.",
            image: "/product/employeecheck.jpg"
        },
        {
            id: 2,
            name: "Education check",
            description: "Thorough screening processes to ensure the right fit for your organization.",
            image: "/product/educationcheck.webp"
        },
        {
            id: 3,
            name: "Criminal check",
            description: "Thorough screening processes to ensure the right fit for your organization.",
            image: "/product/criminalcheck.webp"
        },
        {
            id: 4,
            name: "ID verification",
            description: "Detailed criminal record checks to ensure a safe and secure workplace.",
            image: "/product/idverificationcheck.png"
        },
        {
            id: 5,
            name: "Due diligence",
            description: "Accurate verification of educational qualifications to ensure credibility.",
            image: "/product/deudeligance.jpg"
        },
        {
            id: 6,
            name: "Address verification",
            description: "Comprehensive checks of employment history to ensure authenticity.",
            image: "/product/addressCheck.webp"
        },
        {
            id: 7,
            name: "Social media checks",
            description: "Thorough reference checks to validate candidate's background and performance.",
            image: "/product/socialmediacheck.webp"
        },
        {
            id: 8,
            name: "Database checks",
            description: "Thorough reference checks to validate candidate's background and performance.",
            image: "/product/databasecheck.avif"
        },
        {
            id: 9,
            name: "Credit checks",
            description: "Thorough reference checks to validate candidate's background and performance.",
            image: "/product/creditcheck.webp"
        }
    ]
    const navigate = useNavigate();
    function handleProductClick() {
        navigate('/bgv/list');
    }
    return (
        <div>

            <section className="prd-hero">
                <div className="prd-hero-overlay"></div>

                <div className="prd-hero-content">

                    <div className="prd-hero-left">
                        <p className="prd-breadcrumb">
                            <span onClick={() => navigate('/')} >Home</span> <span>|</span> <span className="active">Our Products</span>
                        </p>

                        <h1 className="prd-hero-title">
                            Explore Our Range Of Products
                        </h1>
                    </div>

                </div>
            </section>
            <section className="prd-section">
            <section className='BGV-section'>
                <div className='bgv-btn' onClick={handleProductClick}>
                    <p>Go to BGV</p>
                    <ArrowBigRight/>
                </div>
            </section>
                <div className="prd-grid-wrapper">
                    <div className="prd-grid-grid">
                        {products.map((product, index) => (
                            <div className="prd-grid-card" key={index} >

                                <img src={product.image} alt={product.name} />

                                <div className="prd-overlay">
                                    <h3 className="prd-grid-title">{product.name}</h3>
                                    <div className="prd-line"></div>
                                    <p className="prd-grid-desc">Mysdom</p>
                                    <span className="prd-arrow">→</span>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Product;