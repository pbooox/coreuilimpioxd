<template>
  <div>
    <CRow>
      <CCol col="12" xl="12">
        <CCard>
           <CCardHeader>
          <h1>¡Bienvenido al panel de administración!</h1>
        </CCardHeader>
          <CCardBody>
            <label>{{texto1}}</label>
          </CCardBody>
          <CCardBody>
            <label>{{texto2}}</label>
          </CCardBody>
        </CCard>
      </CCol>
    
    </CRow>
     <CRow>
      <CCol sm="9" md="6">
        <CCard>
          <CCardHeader><CIcon name="cil-user"/> Arturo Monterroso</CCardHeader>
          <CCardBody><strong>Número: </strong>35130842</CCardBody>
          <CCardBody><strong>Correo: </strong>arturomonterroso3@gmail.com</CCardBody>
        </CCard>
      </CCol>
      <CCol sm="9" md="6">
        <CCard>
          <CCardHeader><CIcon name="cil-user"/> Gerson Juárez</CCardHeader>
          <CCardBody><strong>Número: </strong>55353399</CCardBody>
          <CCardBody><strong>Correo: </strong>agersonjuarez123@gmail.com</CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>

export default {
  name: 'Cards',
  data: function () {
    return {
      show: true,
      isCollapsed: true,
      texto1: '¡En este proyecto podrás editar los datos que se ven en tiempo real en la aplicación!',
      texto2: '¡Cualquier duda o consulta puedes realizarla al equipo de desarrollo!',
      texto3: '¡Cualquier duda o consulta puedes realizarla al equipo de desarrollo!',
    }
  }
}
</script>
