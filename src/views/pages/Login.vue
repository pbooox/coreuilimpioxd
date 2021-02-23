<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Panel de administración</h1>
                  <p class="text-muted">Lotería de las leyendas Xtrema</p>
                  <CInput
                    placeholder="Usuario"
                    autocomplete="username email"
                    v-model="user"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CInput>
                  <CInput
                    placeholder="Contraseña"
                    type="password"
                    autocomplete="curent-password"
                    v-model="password"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton @click="Login()" color="success" class="px-4">Iniciar sesión</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Login',
  data () {
    return {
      user: '',
      password: '',
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page)
        }
      }
    }
  },
  methods: {
    Login(){
      axios.post(`http://localhost:4500/iniciar-sesion`,{
        usuario: this.user,
        password: this.password,
      }).then(function (response) {
        if(response.data === 'usuario'){
          console.log('Usuario no encontrado')
        }
        else if(response.data === 'contra'){
          console.log('Contraseña incorrecta')
        }
        else{
          console.log('Bienvenido')
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    }
  },
}
</script>
