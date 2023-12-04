import axios from "axios"
const TransApi = {
  getAllTrans: async () => {
    const res = await axios.get("/api/transactions/all-transactions")
    return res.data
  },
  getTransbyID: async (transactionId) => {
    const res = await axios.get(`/api/transactions/${transactionId}`)
    return res.data
  },
  addTrans: async (data) => {
    const res = await axios.post("/api/transactions/add-transaction", data)
    return res.data
  },
  updateTrans: async (transactionId, data) => {
    const res = await axios.put(`api/transactions/update-transaction/${transactionId}`, data)
    return res.data
  },
  deleteTrans: async (transactionId) => {
    const res = await axios.delete(`/api/transactions/remove-transaction/${transactionId}`)
    return res.data
  },
}

export default TransApi
