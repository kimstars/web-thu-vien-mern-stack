import React, { useContext, useEffect, useState } from 'react'
import '../AdminDashboard.css'
import axios from 'axios'
import { AuthContext } from '../../../../Context/AuthContext'
import { Dropdown } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import Loading from "../../../../Components/Loader/Loader";

function AddTransaction() {
  const API_URL = process.env.REACT_APP_API_URL
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useContext(AuthContext)

  const [borrowerId, setBorrowerId] = useState([])
  const [borrowerDetails, setBorrowerDetails] = useState([])
  const [bookId, setBookId] = useState("")
  const [recentTransactions, setRecentTransactions] = useState([])
  const [allMembers, setAllMembers] = useState([])
  const [allBooks, setAllBooks] = useState([])

  const [fromDate, setFromDate] = useState(null)
  const [fromDateString, setFromDateString] = useState(null)

  const [toDate, setToDate] = useState(null)
  const [toDateString, setToDateString] = useState(null)


  

  const transactionTypes = [
    { value: 'Reserved', text: 'Đặt trước' },
    { value: 'Issued', text: 'Mượn luôn' },
  ]

  const [transactionType, setTransactionType] = useState('')
  
  /* Adding a Transaction */
  const addTransaction = async (e) => {
    
    e.preventDefault()
    setIsLoading(true)
    if (
      bookId !== '' &&
      borrowerId !== '' &&
      transactionType !== '' &&
      fromDate !== null &&
      toDate !== null
    ) {
      const borrower_details = await axios.get(
        API_URL + 'api/users/getuser/' + borrowerId,
      )
      const book_details = await axios.get(
        API_URL + 'api/books/getbook/' + bookId,
      )

      /* Checking weather the book is available or not */
      console.log(book_details)
      // issued là đã mượn, reserved là độc giả đã đặt trước cuốn sách
      if (
        (book_details.data.bookCountAvailable > 0 &&
          (transactionType === 'Issued' || transactionType === 'Reserved')) ||
        (book_details.data.bookCountAvailable === 0 &&
          transactionType === 'Reserved')
      ) {
        const transactionData = {
          bookId: bookId,
          borrowerId: borrowerId,
          borrowerName: borrower_details.data.userFullName,
          bookName: book_details.data.bookName,
          transactionType: transactionType,
          fromDate: fromDateString,
          toDate: toDateString,
          isAdmin: user.isAdmin,
        }
        try {
          const response = await axios.post(
            API_URL + 'api/transactions/add-transaction',
            transactionData,
          )
          if (recentTransactions.length >= 5) {
            recentTransactions.splice(-1)
          }
          await axios.put(
            API_URL +
            `api/users/${response.data._id}/move-to-activetransactions`,
            {
              userId: borrowerId,
              isAdmin: user.isAdmin,
            },
          )

          await axios.put(API_URL + 'api/books/updatebook/' + bookId, {
            isAdmin: user.isAdmin,
            bookCountAvailable: book_details.data.bookCountAvailable - 1,
          })

          setRecentTransactions([response.data, ...recentTransactions])
          setBorrowerId('')
          setBookId([])
          setTransactionType('')
          setFromDate(null)
          setToDate(null)
          setFromDateString(null)
          setToDateString(null)
          alert('Tạo phiếu mượn thành công 🎉')
        } catch (err) {
          console.log(err)
        }
      } else {
        alert('Cuốn sách này đã hết')
      }
    } else {
      alert('Không được bỏ trống các trường')
    }
    setIsLoading(false)
  }

  /* Fetch Transactions */
  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await axios.get(
          API_URL + 'api/transactions/all-transactions',
        )
        setRecentTransactions(response.data.slice(0, 5))
      } catch (err) {
        console.log('Error in fetching transactions')
      }
    }
    getTransactions()
  }, [API_URL])

  /* Fetching borrower details */
  useEffect(() => {
    const getBorrowerDetails = async () => {
      try {
        if (borrowerId !== '') {
          const response = await axios.get(
            API_URL + 'api/users/getuser/' + borrowerId,
          )
          setBorrowerDetails(response.data)
          console.log(response.data);
        }
      } catch (err) {
        console.log('Error in getting borrower details')
      }
    }
    getBorrowerDetails()
  }, [API_URL, borrowerId])

  /* Fetching members */
  useEffect(() => {
    const getMembers = async () => {
      try {
        const response = await axios.get(API_URL + 'api/users/allmembers')
        const all_members = await response.data.map((member) => ({
          value: `${member?._id}`,
          text: `${member?.userType === 'Student'
            ? `${member?.userFullName}[${member?.admissionId}]`
            : `${member?.userFullName}[${member?.employeeId}]`
            }`,
        }))
        setAllMembers(all_members)
      } catch (err) {
        console.log(err)
      }
    }
    getMembers()
  }, [API_URL])

  const [listBook, setListbook] = useState([])

  /* Fetching books */
  useEffect(() => {
    setIsLoading(true);

    const getallBooks = async () => {
      const response = await axios.get(API_URL + 'api/books/allbooks')
      const allbooks = await response.data.map((book) => ({
        value: `${book._id}`,
        text: `${book.bookName}`,
      }))
      const listbook = response.data
      setListbook(listbook)

      setAllBooks(allbooks)

    }
    getallBooks()

    setIsLoading(false);

  }, [API_URL])

  const [currentBook, setCurrentBook] = useState([])

  useEffect(() => {
    if (bookId !== '') {
      console.log("kiet ", bookId)
      const data = listBook.filter((m) => m._id === bookId)
      if (data.length > 0) setCurrentBook(data)
    }
  }, [bookId])

  if (isLoading) return <Loading />;

  return (
    <div>
      <p className="dashboard-option-title">Tạo phiếu mượn sách</p>
      <div className="dashboard-title-line"></div>
      <form className="transaction-form" onSubmit={addTransaction}>
        <label className="transaction-form-label" htmlFor="borrowerId">
          Độc giả<span className="required-field">*</span>
        </label>
        <br />
        <div className="semanticdropdown">
          <Dropdown
            placeholder="Chọn độc giả"
            fluid
            search
            selection
            value={borrowerId}
            options={allMembers}
            onChange={(event, data) => setBorrowerId(data.value)}
          />
        </div>
        {/* bảng thống kê mượn của độc giả */}
        <table
          className="admindashboard-table shortinfo-table"
          style={borrowerId === '' ? { display: 'none' } : {}}
        >
          <tr>
            <th>Độc giả</th>
            <th>Đã mượn</th>
            <th>Đang mượn</th>
            <th>Điểm</th>
          </tr>
          <tr>
            <td>{borrowerDetails.userFullName}</td>
            <td>
              {
                borrowerDetails.activeTransactions?.filter((data) => {
                  return (
                    data.transactionType === 'Issued' &&
                    data.transactionStatus === 'Active'
                  )
                }).length
              }
            </td>
            <td>
              {
                borrowerDetails.activeTransactions?.filter((data) => {
                  return (
                    data.transactionType === 'Reserved' &&
                    data.transactionStatus === 'Active'
                  )
                }).length
              }
            </td>
            <td>{borrowerDetails.points}</td>
          </tr>
        </table>
        <table
          className="admindashboard-table shortinfo-table"
          style={borrowerId === '' ? { display: 'none' } : {}}
        >
          <tr>
            <th>Tên sách</th>
            <th>Loại mượn</th>
            <th>
              Từ ngày
              <br />
              <span style={{ fontSize: '10px' }}>[MM/DD/YYYY]</span>
            </th>
            <th>
              Đến ngày
              <br />
              <span style={{ fontSize: '10px' }}>[MM/DD/YYYY]</span>
            </th>
            <th>Quá hạn</th>
          </tr>
          {borrowerDetails.activeTransactions
            ?.filter((data) => {
              return data.transactionStatus === 'Active'
            })
            .map((data, index) => {
              console.log("kiet =>", data);
              return (
                <tr key={index}>
                  <td>{data.bookName}</td>
                  <td>{data.transactionType === "Issued"?"Đang mượn":"Đang chờ xử lý"}</td>
                  <td>{data.fromDate}</td>
                  <td>{data.toDate}</td>
                  <td>
                    {Math.floor(
                      (Date.parse(moment(new Date()).format('MM/DD/YYYY')) -
                        Date.parse(data.toDate)) /
                      86400000,
                    ) <= 0
                      ? 0
                      : Math.floor(
                        (Date.parse(moment(new Date()).format('MM/DD/YYYY')) -
                          Date.parse(data.toDate)) /
                        86400000,
                      ) * 10}
                  </td>
                </tr>
              )
            })}
        </table>

        <label className="transaction-form-label" htmlFor="bookName">
          Tên sách<span className="required-field">*</span>
        </label>
        <br />
        <div className="semanticdropdown">
          <Dropdown
            placeholder="Chọn sách"
            fluid
            search
            selection
            options={allBooks}
            value={bookId}
            onChange={(event, data) => {
              setBookId(data.value);
            }
            }
          />
        </div>
        <table
          className="admindashboard-table shortinfo-table"
          style={bookId === '' ? { display: 'none' } : {}}
        >
          <tr>
            <th>Ảnh bìa</th>
            <th>Tên sách</th>
            <th>Số sách sẵn có</th>
            <th>Đã đặt trước</th>
          </tr>

          {currentBook.map((data, index) => {
            return (
              <tr>

                <td><img src={"/imageBook/" + data.image_url} alt="" href={`/book/${data._id}`} ></img></td>
                <td>{data.bookName}</td>
                <td>{data.bookCountAvailable}</td>
                <td>{data.transactions.length}</td>
              </tr>
            )
          })}
        </table>

        <label className="transaction-form-label" htmlFor="transactionType">
          Loại mượn<span className="required-field">*</span>
        </label>
        <br />
        <div className="semanticdropdown">
          <Dropdown
            placeholder="Chọn loại giao dịch"
            fluid
            selection
            value={transactionType}
            options={transactionTypes}
            onChange={(event, data) => setTransactionType(data.value)}
          />
        </div>
        <br />

        <label className="transaction-form-label" htmlFor="from-date">
          Từ ngày<span className="required-field">*</span>
        </label>
        <br />
        <DatePicker
          className="date-picker"
          placeholderText="MM/DD/YYYY"
          selected={fromDate}
          onChange={(date) => {
            setFromDate(date)
            setFromDateString(moment(date).format('MM/DD/YYYY'))
          }}
          minDate={new Date()}
          dateFormat="MM/dd/yyyy"
        />

        <label className="transaction-form-label" htmlFor="to-date">
          Đến ngày<span className="required-field">*</span>
        </label>
        <br />
        <DatePicker
          className="date-picker"
          placeholderText="MM/DD/YYYY"
          selected={toDate}
          onChange={(date) => {
            setToDate(date)
            setToDateString(moment(date).format('MM/DD/YYYY'))
          }}
          minDate={new Date()}
          dateFormat="MM/dd/yyyy"
        />

        <input
          className="transaction-form-submit"
          type="submit"
          value="SUBMIT"
          disabled={isLoading}
        ></input>
      </form>
      <p className="dashboard-option-title">Mượn trả gần đây</p>
      <div className="dashboard-title-line"></div>
      <table className="admindashboard-table">
        <tr>
          <th>STT</th>
          <th>Tên sách</th>
          <th>Người mượn</th>
          <th>Ngày mượn</th>
        </tr>
        {recentTransactions.map((transaction, index) => {
          console.log("kiet => ", transaction);
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{transaction.bookName}</td>
              <td>{transaction.borrowerId.userFullName}</td>
              <td>{transaction.updatedAt.slice(0, 10)}</td>
            </tr>
          )
        })}
      </table>
    </div>
  )
}

export default AddTransaction
