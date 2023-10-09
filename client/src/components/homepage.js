/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import image from '../views/carousel-1.jpg'
import aboutimage from '../views/about.jpg'
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS CSS
import { useEffect } from 'react';
import axios from 'axios';
import careerleaplogo from '../views/careerleaplogo2.png';
import '../styles/homepage.css'

function Elearning() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const [message, setmessage] = useState(null)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Handle form submission here (e.g., send data to a server or perform some action)
            const response = await axios.post('/enquiry', {
                formData,
            });

            setmessage(response.data.message);

            // Reset the form fields to empty values
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: '',
            });
        } catch (error) {
            // Handle the error appropriately
            console.error('Form Submission Error:', error);
        }
    };


    useEffect(() => {
        AOS.init({
            duration: 800,   // Animation duration in milliseconds
            delay: 200,      // Animation delay in milliseconds
            once: false,       // Animation only occurs once
        });
    }, []);



    return (
        <div className='headcontainers'>

            {/* Navbar Start */}
            <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
                {/* Replace anchor tags with React Router Links if needed */}

                <a href="index.html" className="navbar-brand d-flex align-items-center px-4 px-lg-5">
                    <img src={careerleaplogo} alt="Bootstrap" width="50" height="50" />
                    <h2 className="m-0 text-primary">CareerLeap</h2>
                </a>
                <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto p-4 p-lg-0">
                        {/* Replace anchor tags with React Router Links if needed */}
                        <a href="/" className="nav-item nav-link active">Home</a>
                        <a href="#aboutcontainer" className="nav-item nav-link">About</a>
                        <a href="#courseside" className="nav-item nav-link">Courses</a>

                        {/* Replace anchor tags with React Router Links if needed */}
                        <a href="#enquirycontainer" className="nav-item nav-link">Contact</a>
                        <a href="/register" className="nav-item nav-link">Register</a>
                    </div>
                    {/* Replace anchor tags with React Router Links if needed */}
                    <a href="/register" className="btn btn-primary py-3 px-lg-4 d-none d-lg-block">Join Now<i className="fa fa-arrow-right ms-3"></i></a>
                </div>
            </nav>

            <div id="carouselExample" className="carousel slide">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={image} className="d-block w-100" alt="..." />
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" style={{ background: "rgba(24, 29, 56, .7)" }}>
                            <div className="carouselheadcontainers p-4 m-auto">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-8"> {/* Adjust columns for small screens */}
                                        <h5 className="text-primary m-auto row justify-content-center text-uppercase mb-3 animated slideInDown">Best Online Courses</h5>
                                        <h1 className="display-2 m-auto fw-bold text-white animated slideInDown">The Best Online Learning Platform</h1>
                                        <p className="fs-5 text-white mb-4 pb-2">"Exploring the Vast World of Knowledge and Learning Through a Multifaceted Platform Designed to Inspire and Empower Students of All Ages and Backgrounds."</p>
                                        <a href="" className="btn btn-primary py-md-3 px-md-5 me-3 animated slideInLeft">Read More</a>
                                        <a href="/register" className="btn btn-light py-md-3 px-md-5 animated slideInRight">Join Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Add more carousel items as needed */}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>



            <div class="container-lg py-5">
                <div class="container-fluid" data-aos="zoom-in">
                    <div class="row g-4">
                        <div class="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
                            <div class="service-item text-center pt-3">
                                <div class="p-4">
                                    <i class="fa fa-3x fa-graduation-cap text-primary mb-4"></i>
                                    <h5 class="mb-3">Professional Tasks</h5>
                                    <p>Unlocking Knowledge with Expert Guidance</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
                            <div class="service-item text-center pt-3">
                                <div class="p-4">
                                    <i class="fa fa-3x fa-globe text-primary mb-4"></i>
                                    <h5 class="mb-3">Online Classes</h5>
                                    <p>Learning Anytime, Anywhere</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
                            <div class="service-item text-center pt-3">
                                <div class="p-4">
                                    <i class="fa fa-3x fa-home text-primary mb-4"></i>
                                    <h5 class="mb-3">Home Projects</h5>
                                    <p>Hands-On Learning Adventures</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
                            <div class="service-item text-center pt-3">
                                <div class="p-4">
                                    <i class="fa fa-3x fa-book-open text-primary mb-4"></i>
                                    <h5 class="mb-3">Book Library</h5>
                                    <p>Exploring Boundless Worlds Through Pages</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <div class="container-lg py-5" id='aboutcontainer'>
                <div class="container-fluid" data-aos="fade-up-right">
                    <div class="row g-5">
                        <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.1s" >
                            <div class="position-relative h-100">
                                <img class="img-fluid position-absolute w-95 h-100" src={aboutimage} alt="" />
                            </div>
                        </div>
                        <div class="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
                            <h6 class="section-title row justify-content-center text-start text-primary pe-3">About Us</h6>
                            <h1 class="mb-4">Welcome to CareerLeap</h1>
                            <p class="mb-4">CareerLeap: Where Aspiring Developers Embrace Technology, Hone Coding Skills, and Pave the Way to a Brighter Future</p>

                            <div class="row gy-2 gx-4 mb-4">
                                <div class="col-sm-6">
                                    <p class="mb-0"><i class="fa fa-arrow-right text-primary me-2"></i>Train to be Skilled</p>
                                </div>
                                <div class="col-sm-6">
                                    <p class="mb-0"><i class="fa fa-arrow-right text-primary me-2"></i>Online Self-Learining Classes</p>
                                </div>
                                <div class="col-sm-6">
                                    <p class="mb-0"><i class="fa fa-arrow-right text-primary me-2"></i>Compiler</p>
                                </div>
                                <div class="col-sm-6">
                                    <p class="mb-0"><i class="fa fa-arrow-right text-primary me-2"></i>Week Task</p>
                                </div>
                                <div class="col-sm-6">
                                    <p class="mb-0"><i class="fa fa-arrow-right text-primary me-2"></i>Manifest</p>
                                </div>
                                <div class="col-sm-6">
                                    <p class="mb-0"><i class="fa fa-arrow-right text-primary me-2"></i>PDF</p>
                                </div>
                            </div>
                            <a class="btn btn-primary py-3 px-5 mt-2" href="">Read More</a>
                        </div>
                    </div>
                </div>
            </div>


            <div className="container" id='courseside'>
                <h1 class=" m-auto row justify-content-center fw-bold text-dark animated slideInDown">Course</h1>
                <div class="coursehomecontainer mt-4" data-aos="fade-up">
                    <div class="box" style={{ color: "#fc5f9b" }}>
                        <div class="content">
                            <div class="icon">
                                <i class="fas fa-code"></i>
                            </div>
                            <div class="text">
                                <h3>MERN</h3>
                                <p>5 projects</p>
                            </div>
                        </div>
                    </div>
                    <div class="box" style={{ color: "#a362ea" }}>
                        <div class="content">
                            <div class="icon">
                                <i class="fas fa-brush"></i>
                            </div>
                            <div class="text">
                                <h3>MEAN</h3>
                                <p>3 projects</p>
                            </div>
                        </div>
                    </div>
                    <div class="box" style={{ color: "#0ed095" }}>
                        <div class="content">
                            <div class="icon">
                                <i class="fas fa-laptop-code"></i>
                            </div>
                            <div class="text">
                                <h3>FLUTTER</h3>
                                <p>8 projects</p>
                            </div>
                        </div>
                    </div>
                    <div class="box" style={{ color: "#5bc0de" }}>
                        <div class="content">
                            <div class="icon">
                                <i class="fas fa-code"></i>
                            </div>
                            <div class="text">
                                <h3>DJANGO</h3>
                                <p>5 projects</p>
                            </div>
                        </div>
                    </div>
                    <div class="box" style={{ color: "#0ed0589" }}>
                        <div class="content">
                            <div class="icon">
                                <i class="fa fa-brush"></i>
                            </div>
                            <div class="text">
                                <h3>GOLANG</h3>
                                <p>3 projects</p>
                            </div>
                        </div>
                    </div>
                    <div class="box" style={{ color: "#f0ad4e" }}>
                        <div class="content">
                            <div class="icon">
                                <i class="fas fa-laptop-code"></i>
                            </div>
                            <div class="text">
                                <h3>PYTHON</h3>
                                <p>8 projects</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container-xxl py-5" id='enquirycontainer'>
                <div class="container-fluid" data-aos="fade-up">
                    <div class="row g-5">
                        <form onSubmit={handleSubmit}>
                            <h1>Enquiry Form</h1>
                            <div className=" inputContainer mb-3 ">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control border border-dark"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="inputContainer mb-3">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-control border border-dark"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="inputContainer mb-3">
                                <label htmlFor="phone" className="form-label">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    className="form-control border border-dark"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="inputContainer mb-3">
                                <label htmlFor="message" className="form-label">
                                    Message
                                </label>
                                <textarea
                                    className="form-control border border-dark"
                                    id="message"
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </form>
                        <p>{message}</p>
                    </div>
                </div>
            </div>

            <div class="container-fluid bg-dark text-light footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s">
                <div class="container-fluid py-5" >
                    <div class="row g-5">
                        <div class="col-lg-6 col-md-6">
                            <h4 class="text-white mb-3">Quick Link</h4>
                            <a class="btn btn-link" href="">About Us</a>
                            <a class="btn btn-link" href="">Contact Us</a>
                            <a class="btn btn-link" href="">Privacy Policy</a>
                            <a class="btn btn-link" href="">Terms & Condition</a>
                            <a class="btn btn-link" href="">FAQs & Help</a>
                        </div>
                        <div class="col-lg-6 col-md-6">
                            <h4 class="text-white mb-3">Contact</h4>
                            <p class="mb-2 text-white"><i class="fa fa-map-marker-alt me-3"></i>Maradu, Kerala, India</p>
                            <p class="mb-2 text-white"><i class="fa fa-phone-alt me-3"></i>+012 345 67890</p>
                            <p class="mb-2 text-white"><i class="fa fa-envelope me-3"></i>info@brototype.com</p>
                            <div class="d-flex pt-2">
                                <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-twitter"></i></a>
                                <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-facebook-f"></i></a>
                                <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-youtube"></i></a>
                                <a class="btn btn-outline-light btn-social" href=""><i class="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>


        </div>
    );
}

export default Elearning;
