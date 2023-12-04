import React, { useEffect, useContext, useState } from 'react';

import "../AdminDashboard.css";
import axios from 'axios';
import { AuthContext } from '../../../../Context/AuthContext';

import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Modal,
    Card,
    CardContent,
    CardActions,
    Typography,
    TablePagination
} from "@mui/material"
import { tableCellClasses } from '@mui/material/TableCell';

import getUrlImage from "../../../../Pages/getURLimage"
import Loading from "../../../../Components/Loader/Loader";
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 20,
      
    },
  }));


function AddBook() {
    const { user } = useContext(AuthContext);
    const API_URL = process.env.REACT_APP_API_URL
    const [loading, setLoading] = useState(false);

    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [openModal, setOpenModal] = useState(false)
    const [activeBookID, setActiveBookID] = useState(null)


    const fetchBooks = async () => {
        const response  = await axios.get(API_URL+"api/books/allbooks")
        setBooks(response.data);
        setLoading(false);
        console.log(response.length)

    }
    useEffect(() => {
        setLoading(true)
        fetchBooks();

    },[])

    const deleteBook = async ()=>{
        try {
            if(activeBookID!== null){

                const response  = await axios.delete(API_URL+"api/books/removebook/"+activeBookID,{
                    isAdmin: user.isAdmin,
                })
                alert("Xóa đầu sách thành công!!"+ response)
                setOpenModal(false);
            }
        } catch (err) {
            console.log(err);
            alert("Đã xảy ra lỗi!!");
        }
    }

    
    if (loading) return <Loading />;

    return (
        <div>
            <div>
                <p className="dashboard-option-title">Tất cả đầu sách</p>
                <div className="dashboard-title-line"></div>
            </div>
            <>
            {books.length > 0 ? (
                <>
                    <div className="tableContainer">
                        <TableContainer component={Paper}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Ảnh bìa</StyledTableCell>
                                        <StyledTableCell>Tên sách</StyledTableCell>
                                        <StyledTableCell>Thể loại</StyledTableCell>
                                        <StyledTableCell>Số lượng</StyledTableCell>

                                        <StyledTableCell>Hành động</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? books.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : books
                                    ).map((book) => (
                                        <TableRow key={book.isbn}>
                                            <TableCell >
                                                <img className="image-table"src={getUrlImage(book.image_url)} alt=""></img>

                                            </TableCell>
                                            <TableCell align="right">{book.bookName}</TableCell>
                                            <TableCell>{book.categories}</TableCell>
                                            <TableCell align="right">{book.bookCountAvailable}</TableCell>
                                            <TableCell>
                                                <div className="actionsContainer">
                                                    <Button
                                                        variant="contained"
                                                        // component={RouterLink}
                                                        size="small"
                                                        
                                                    >
                                                        Xem
                                                    </Button>
                                                    {user.isAdmin && (
                                                        <>
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                // component={RouterLink}
                                                                size="small"
                                                                to={`/admin/books/${book._id}/edit`}
                                                            >
                                                                Sửa
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                color="error"
                                                                size="small"
                                                                onClick={(e) => {
                                                                    setActiveBookID(book._id)
                                                                    setOpenModal(true)
                                                                }}
                                                            >
                                                                Xóa
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10))
                                setPage(0)
                            }}
                            component="div"
                            count={books.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                        />
                        <Modal open={openModal} onClose={(e) => setOpenModal(false)}>
                            <Card className="conf_modal">
                                <CardContent>
                                    <h2>Bạn có chắc chắn xóa?</h2>
                                </CardContent>
                                <CardActions className="conf_modal_actions">
                                    <Button variant="contained" color="primary" onClick={() => setOpenModal(false)}>
                                        Hủy bỏ
                                    </Button>
                                    <Button variant="contained" color="error" onClick={deleteBook}>
                                        Xóa
                                    </Button>
                                </CardActions>
                            </Card>
                        </Modal>
                    </div>
                </>
            ) : (
                <Typography variant="h5">No books found!</Typography>
            )}


            </>

            </div>
      
    )
}

export default AddBook;