import React, { useContext, useEffect, useState } from 'react'
import ServiceGrid from '../ServiceGrid';
import axiosInstance from '../../api/axiosInstance';
import './product.css'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowBigDownIcon, ArrowBigRight, ChevronsRight, ClipboardList, ScreenShare, ShieldCheck, Users, Plus } from 'lucide-react';

function Product() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    
    // Local products array with images
    const productImages = [
        {
            id: 1,
            name: "Employment check",
            image: "/product/employeecheck.jpg"
        },
        {
            id: 2,
            name: "Education check",
            image: "/product/educationcheck.webp"
        },
        {
            id: 3,
            name: "Criminal check",
            image: "/product/criminalcheck.webp"
        },
        {
            id: 4,
            name: "ID verification",
            image: "/product/idverificationcheck.png"
        },
        {
            id: 5,
            name: "Due diligence",
            image: "/product/deudeligance.jpg"
        },
        {
            id: 6,
            name: "Address verification",
            image: "/product/addressCheck.webp"
        },
        {
            id: 7,
            name: "Social media checks",
            image: "/product/socialmediacheck.webp"
        },
        {
            id: 8,
            name: "Database checks",
            image: "/product/databasecheck.avif"
        },
        {
            id: 9,
            name: "Credit checks",
            image: "/product/creditcheck.webp"
        }
    ];

    const [products, setProducts] = useState([]);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosInstance.get('/product/list');
                const apiProducts = response.data?.data || [];

                // Map API data with local images
                const mergedProducts = apiProducts.map((apiProduct) => {
                    const imageData = productImages.find(
                        (img) => img.name.toLowerCase() === apiProduct.title.toLowerCase()
                    );
                    return {
                        ...apiProduct,
                        image: imageData?.image || '/product/socialmediacheck.webp' // Fallback image
                    };
                });

                setProducts(mergedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Failed to load products');
                // Fallback to local products with images
                const fallbackProducts = productImages.map((img) => ({
                    ...img,
                    description: 'Service description'
                }));
                setProducts(fallbackProducts);
            }
        };

        fetchProducts();
    }, []);
    function handleProductClick() {
        navigate('/bgv/list');
    }
    return (
        <div>

            <section className="prd-hero">
                <div className="prd-hero-overlay"></div>

                <div className="prd-hero-content">

                    <div className="prd-hero-left">
                        <div className="prd-hero-top">
                          <p className="prd-breadcrumb">
                              <span onClick={() => navigate('/')} >Home</span> <span>|</span> <span className="active">Our Products</span>
                          </p>
                        </div>

                        <h1 className="prd-hero-title">
                            Explore Our Range Of Products
                        </h1>
                    </div>

                </div>
            </section>
            <section className="prd-section">
            <section className='BGV-section'>
                {['admin','superadmin'].includes(user?.role) && (
                            <button
                              className="prd-add-btn"
                              type="button"
                              onClick={() => navigate('/product/add')}
                            >
                              <Plus size={18} /> Create Product
                            </button>
                          )}
                {['admin','superadmin','user'].includes(user?.role) && <div className='bgv-btn' onClick={handleProductClick}>
                    <p>Go to BGV</p>
                    <ArrowBigRight size={18}/>
                </div>}
            </section>
                <div className="prd-grid-wrapper">
                    <div className="prd-grid-grid">
                        {products.map((product, index) => (
                            <div
                                className="prd-grid-card"
                                key={index}
                                onClick={() => {
                                    if (['admin','superadmin'].includes(user?.role)) {
                                        navigate(`/product/view/${product.id}`);
                                    }
                                }}
                                style={{
                                    cursor: ['admin','superadmin'].includes(user?.role) ? 'pointer' : 'default'
                                }}
                            >

                                <img src={product.image} alt={product.name} />

                                <div className="prd-overlay">
                                    <h3 className="prd-grid-title">{product.title}</h3>
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