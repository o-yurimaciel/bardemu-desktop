import axios from 'axios'
const isDevelopment = process.env.NODE_ENV !== 'production'

const bardemu = axios.create({
  baseURL: isDevelopment ? 'http://localhost:5050' : 'https://bardemu-backend.herokuapp.com'
})

export {
  bardemu
}