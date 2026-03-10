import React, { useEffect, useState } from 'react'
import Pagination from '../commn/Pagination';
import ServiceGrid from '../ServiceGrid';
import axiosInstance from '../../api/axiosInstance';
import './services.css'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Services() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [totalPages, setTotalPages] = useState(1);
    const [services,setServices] = useState([]);
    const navigate = useNavigate();
    let user = JSON.parse(localStorage.getItem('user'));
    console.log('getuser:',user);
     const fetchServices = async () => {
        try {
            const res = await axiosInstance.get(
                "/service/list",
                {
                    params: {
                        search,
                        page,
                        limit,
                    },
                }
            );

            const serviceData = res?.data?.data?.services || [];
            const totalCount = res?.data?.data?.count || 0;

            setServices(serviceData);

            // 🔥 Calculate total pages
            setTotalPages(Math.ceil(totalCount / limit));

        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to load Services"
            );
        }
    };
    useEffect(() => {
        fetchServices();
    }, [page, search]);
    return (
        <div>
            <section className="services-section">
                <div className="services-container">
                    <p className="services-tag">
                        WHAT SERVICES DOES MYSDOM OFFER?
                    </p>

                    <h2 className="services-title">
                        Explore Range of Services
                    </h2>

                    <p className="services-subtitle">
                        Our comprehensive offerings are the result of continuous innovation,
                        customer feedback, and expertise in Indian employment screening
                        solutions.
                    </p>

                    {/* <a href="#" className="explore-link">
                        Explore All Services <ArrowRight size={16} />
                    </a> */}
                    {/* Search */}
                    <div className='filter-section'>
                       
                        <div className="um-search-container">
                            <input
                                type="text"
                                placeholder="Search user..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                        {['admin','superadmin'].includes(user?.role)&&<button className="add-service-btn" onClick={()=>(navigate('/service/add'))}>
                            + Add Service
                        </button>}
                         
                    </div>
                    <ServiceGrid services={services} />
                    {/* pagination section */}
                    <Pagination  
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}  
                    />

                </div>
            </section>
        </div>
    )
}

export default Services