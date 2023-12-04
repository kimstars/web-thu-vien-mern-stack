import React, { useEffect, useContext, useState } from 'react';

import "../AdminDashboard.css";
import axios from 'axios';
import { AuthContext } from '../../../../Context/AuthContext';
import { Dropdown } from 'semantic-ui-react';

import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll
} from "firebase/storage";
import { storage } from "../../../../firebase";

import {
    Button,
    TextField,
    Modal,
    Card,
    CardContent,
    CardActions,
    Typography,
    TablePagination,
} from "@mui/material"

function AddBook() {
    const API_URL = process.env.REACT_APP_API_URL
    const { user } = useContext(AuthContext);

    const [recentAddedBooks, setRecentAddedBooks] = useState([]);
    const [bookName, setBookName] = useState("");
    const [author, setAuthor] = useState("");
    const [bookCountAvailable, setBookCountAvailable] = useState(null);
    const [language, setLanguage] = useState("vi");
    const [publisher, setPublisher] = useState("");
    const [allCategories, setAllCatagories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [alternateTitle, setAlternateTitle] = useState("");
    const [imageUpload, setImageUpload] = useState(null);
    const [imageURL, setImageURL] = useState("");

    const [openModal, setOpenModal] = useState(false);

    const [categoryName, setCategoryName] = useState('');

    const [selectedImage, setSelectedImage] = useState(null);
    // eslint-disable-next-line no-unused-expressions
    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await axios.get(API_URL + "api/books/getallcate")
                const all_categories = await response.data.map((category) => (
                    { value: `${category}`, text: `${category}` }
                ))
                setAllCatagories(all_categories)
            }
            catch (err) {
                console.log(err)
            }
        }
        getAllCategories()
    }, [API_URL])

    useEffect(()=>{
        console.log(imageUpload);

    },[imageUpload])

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
    
        reader.onload = (e) => {
          setSelectedImage(e.target.result);
        };
    
        if (file) {
          reader.readAsDataURL(file);
        }
      };
    
    const addCate = async (e) => {
        e.preventDefault();

        const CateData = {
            categoryName:categoryName
        }

        try {
            const response = await axios.post(API_URL + "api/categories/addcategory", CateData)

            alert("Thêm thể loại '"+ categoryName +"' thành công 🎉");
            setOpenModal(false);
            setCategoryName("");
        } catch (error) {
            console.log(error);
        }
    }

    const addBook = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (imageUpload == null) return;
        const imageRef = ref(storage, `image/${imageUpload.name}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageURL(url);
            });
        });


        const BookData = {
            bookName: bookName,
            alternateTitle: alternateTitle,
            author: author,
            bookCountAvailable: bookCountAvailable,
            language: language,
            publisher: publisher,
            categories: selectedCategories,
            isAdmin: user.isAdmin,
            image_url: imageUpload.name
        }

        try {
            const response = await axios.post(API_URL + "api/books/addbook", BookData)
            if (recentAddedBooks.length >= 5) {
                recentAddedBooks.splice(-1)
            }
            setRecentAddedBooks([response.data, ...recentAddedBooks])
            setBookName("")
            setAlternateTitle("")
            setAuthor("")
            setBookCountAvailable(null)
            setLanguage("")
            setPublisher("")
            setSelectedCategories([])
            setImageURL("");

            alert("Thêm sách thành công 🎉")
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);

    }

    useEffect(() => {
        const getAllBookks = async () => {
            const response = await axios.get(API_URL + "api/books/allbooks");
            setRecentAddedBooks(response.data.slice(0, 5));
        }

        getAllBookks();
    }, [API_URL]);


    return (
        <div>
            <p className="dashboard-option-title">Thêm một đầu sách mới</p>
            <div className="dashboard-title-line"></div>
            <form className='addbook-form' onSubmit={addBook}>

                <label className="addbook-form-label" htmlFor="bookName">Tên sách<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="bookName" value={bookName} onChange={(e) => { setBookName(e.target.value) }} required></input><br />

                <label className="addbook-form-label" htmlFor="alternateTitle">Tiêu đề thay thế</label><br />
                <input className="addbook-form-input" type="text" name="alternateTitle" value={alternateTitle} onChange={(e) => { setAlternateTitle(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="author">Tên tác giả<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="author" value={author} onChange={(e) => { setAuthor(e.target.value) }} required></input><br />

                <label className="addbook-form-label" htmlFor="language">Ngôn ngữ</label><br />
                <input className="addbook-form-input" type="text" name="language" value={language} onChange={(e) => { setLanguage(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="publisher">Nhà xuất bản</label><br />
                <input className="addbook-form-input" type="text" name="publisher" value={publisher} onChange={(e) => { setPublisher(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="copies">Số lượng sách sẵn có<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" name="copies" value={bookCountAvailable} onChange={(e) => { setBookCountAvailable(e.target.value) }} required></input><br />

                <label className="addbook-form-label" htmlFor="categories">Thể loại<span className="required-field">*</span></label><br />
                <div className="semanticdropdown">
                        <Dropdown
                            placeholder='Chọn thể loại'
                            fluid
                            // multiple
                            search
                            selection
                            options={allCategories}
                            value={selectedCategories}
                            onChange={(event, value) => setSelectedCategories(value.value)}
                        />

                        <input className="" type="button" value="Thêm thể loại" onClick={() =>setOpenModal(true)} ></input>
                </div>

                <label className="addbook-form-label" htmlFor="categories">Ảnh bìa<span className="required-field">*</span></label><br />
                <input type="file" onChange={(e) => {
                    setImageUpload(e.target.files[0]);
                    handleImageUpload(e);
                }
                } />
                <img  className="image-table" src={selectedImage} alt="" srcset="" />
                <div>
                    <input className="addbook-submit" type="submit" value="Lưu thông tin" disabled={isLoading}></input>
                </div>
            </form>

            <div>
            <Modal open={openModal} onClose={(e) => setOpenModal(false)}>
                <Card className="conf_modal">
                    <CardContent>
                        <h2>Thêm thể loại</h2>
                    </CardContent>
                    <CardActions className="conf_modal_actions">
                                                    
                            <TextField
                            label="Tên thể loại"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            fullWidth
                            />
                      
                    </CardActions>
                    <div className="button-modal">
                        <Button className="button-modal" variant="contained" color="error" onClick={() => setOpenModal(false)}>
                            Hủy bỏ
                        </Button>
                        <Button className="button-modal" variant="contained" color="success" onClick={addCate}>
                            Lưu 
                        </Button>
                    </div>
                </Card>
            </Modal>
            </div>

            <div>
                <p className="dashboard-option-title">Sách mới thêm gần đây</p>
                <div className="dashboard-title-line"></div>
                <table className='admindashboard-table'>
                    <tr>
                        <th>STT</th>
                        <th>Tên sách</th>
                        <th>Ngày thêm</th>
                    </tr>
                    {
                        recentAddedBooks.map((book, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{book.bookName}</td>
                                    <td>{book.createdAt.substring(0, 10)}</td>
                                </tr>
                            )
                        })
                    }
                </table>
            </div>
        </div>
    )
}

export default AddBook;