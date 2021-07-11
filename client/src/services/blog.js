import axios from 'axios'

const baseUrl = '/api/blogs'

const token = () => JSON.parse(window.localStorage.loggedUser).token

const bearerToken = () => `bearer ${token()}`

const config = () => ({
  headers: {
    Authorization: bearerToken(),
  },
})

const getAll = () => axios.get(baseUrl)

const create = (payload) => axios.post(baseUrl, payload, config())

const like = (blogId) => axios.patch(`${baseUrl}/${blogId}`, { likes: 'like' })

const remove = (blogId) => axios.delete(`${baseUrl}/${blogId}`, config())

const update = (payload, blogId) =>
  axios.put(`${baseUrl}/${blogId}`, payload, config())

export default { create, getAll, like, remove, update }
