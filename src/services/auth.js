import Ls from './ls'

export default {
  async login (loginData) {
    try {
      let response = await axios.post('/iniciar-sesion', loginData)
      Ls.set('auth.token', response.data.token)
      return response.data.token
    } catch (error) {
      if (error.response.status === 401) {
        console.log('Credenciales incorrectas')
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
    }
  },

  async logout () {
    try {
      await axios.get('/cerrar-sesion')

      Ls.remove('auth.token')
      toastr['success']('Sesión finalizada', 'Éxito')
    } catch (error) {
      console.log('Error', error.message)
    }
  },

  async check () {
    let response = await axios.get('/api/auth/check')

    return !!response.data.authenticated
  }
}
