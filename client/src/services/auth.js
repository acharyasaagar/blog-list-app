import axios from 'axios'

const baseUrl = '/api/login'

const login = (credentials) => axios.post(baseUrl, credentials)

const signup = (credentials) => axios.post('/api/users', credentials)

export default { login, signup }
