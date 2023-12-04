import axios from "axios"
const UserApi = {
  getAllUser: async () => {
    const res = await axios.get("/api/users/allmembers")
    return res.data
  },
  getUserbyID: async (userId) => {
    const res = await axios.get(`/api/users/getuser/${userId}`)
    return res.data
  },
  addUser: async (data) => {
    const res = await axios.post("/api/users/addbook", data)
    return res.data
  },
  updateUser: async (userId, data) => {
    const res = await axios.put(`api/users/updateuser/${userId}`, data)
    return res.data
  },
  deleteUser: async (userId) => {
    const res = await axios.delete(`/api/users/remove-Useraction/${userId}`)
    return res.data
  },
  move2activeTrans: async (userId, data) => {
    const res = await axios.put(`api/users/${userId}/move-to-activetransactions`, data)
    return res.data
  },
  move2preTrans: async (userId, data) => {
    const res = await axios.put(`api/users/${userId}/move-to-prevtransactions`, data)
    return res.data
  },
}

export default UserApi
