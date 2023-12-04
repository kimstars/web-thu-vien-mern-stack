import React, { useEffect, useState } from 'react'
import './BookList.css'
import axios from 'axios'
import Loading from "../Loader/Loader";
import { Link } from 'react-router-dom';
import Footer from '../Footer/Footer'

// import BookApi from "../../callAPI/BookApi"

function ListCate() {
    const API_URL = process.env.REACT_APP_API_URL

    const [listCate, setListCate] = useState([])
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        const getListCate = async () => {
            try {

                const response = await axios.get(API_URL + "api/books/getallcate")
                setListCate(response.data);
                setLoading(false);
                console.log(listCate);
            } catch (err) {
                setLoading(false);
                console.log('Error when get list book =>', err)
            }
        }
        getListCate()
    }, [])


    if (loading) return <Loading />;

    return (
        <div className="block-page">
            <div className="books-page">
                <div className="title">
                    <label htmlFor="category">Danh sách thể loại</label><br />
                </div>

                <div className="books">

                    {
                        listCate.map((item) => {
                            console.log(item);
                            return (
                                <div className="book-card">
                                    <Link to={`/category/${item}`}>

                                        <p className="bookcard-title"><b>{item}</b></p>

                                    </Link>

                                </div>
                            )

                        }
                        )}

                </div>
            </div>

            <Footer/>
        </div>


    )
}


export default ListCate