import axios from 'axios'

const bardemu = axios.create({
  baseURL: 'https://bardemu-backend.herokuapp.com'
})

export {
  bardemu
}