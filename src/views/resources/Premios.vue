<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <div>Premios</div>
        </CCardHeader>
        <br>
        <CCol col="2" sm="2" md="2" xl class="mb-3 mb-xl-0">
            <CButton @click="openModal('register', '')" color="info">Nuevo</CButton>
          </CCol>
        <CCardBody>
          <CDataTable
            hover
            striped
            :items="items"
            :fields="fields"
            :items-per-page="10"
            :active-page="activePage"
            :pagination="{ doubleArrows: false, align: 'center'}"
            @page-change="pageChange"
          >

          <template #estado="data">
            <td>
              <CBadge :color="getBadge(data.item.estado)">
                {{data.item.estado}}
              </CBadge>
            </td>
          </template>

          <template #acciones="data">
            <td>

              <div class="btn-group mr-2"
                role="group"
                aria-label="First group"
              >
                <button @click="openModal('update', data.item)" class="btn btn-info">Editar</button>
                
                <!-- Preguntar si se deja editar y desactivar escrito o solo los iconos -->
                <button v-if="data.item.estado==='Activo'" class="btn btn-danger">Desactivar</button>
                <button v-else class="btn btn-success">Activar</button>
              </div>
            </td>
          </template>
            
          </CDataTable>


          <sweet-modal ref="nuevo_usuario" :title="titleModal" hide-close-button blocking>
            <!-- START FORM -->
            <div class="form-group">
              <CInput
                label="Nombre"
                placeholder="Ingresa el nombre"
                v-model="nombre"
              />
              <CInput
                label="Fichas para canje"
                placeholder="Ingresa la cantidad de fichas necesarias"
                v-model="fichas"
                type="number"
                min="0"
              />
              <label>Tipo de premio</label>
              <select class="form-control " v-model="tipo">
                <option value="Seleccione" disabled>Seleccione...</option>
                <option value="amarillo">Amarillo</option>
                <option value="morado">Morado</option>
                <option value="blanco">Blanco</option>
                <option value="rojo">Rojo</option>
              </select>
              <br>
              <CInput
                label="Descripción del premio"
                placeholder="Ingresa la descripción"
                v-model="descripcion"
              />
              <CInput
                label="Dirección del premio"
                placeholder="Ingresa la dirección para canje"
                v-model="direccion"
              />
              <CInput
                label="Empresa"
                placeholder="Ingresa el nombre de la empresa"
                v-model="empresa"
              />
              <CInput
                label="Contacto"
                placeholder="Ingresa el contacto de la empresa"
                v-model="contacto"
              />
              <CInput
                label="Fecha de vencimiento del canje"
                placeholder="Ingresa el nombre"
                v-model="vencimiento"
                type="date"
              />
              <CInput
                label="Cantidad de premios disponibles"
                placeholder="Ingresa la cantidad de premios"
                v-model="cantidad"
                type="number"
                min="0"
              />
              <CInput
                label="Imagen del premio"
                placeholder="Ingresa la imagen del premio"
                v-model="imagen"
              />
              <div>
                <br>
              </div>
              <CCard v-show="errorPremio" color="danger" class="text-center" body-wrapper text-color="white">
                <blockquote v-for="error in errorShowMessagePremio" :key="error" v-text="error" class="card-blockquote">
                  
                </blockquote>
              </CCard>
            </div>
            
            <!-- END FORM -->
            <!-- START BUTTONS -->
            <button slot="button" type="button" class="btn btn-danger" @click="closeModal()">Cancelar</button>
            <button
              slot="button"
              type="button"
              class="btn btn-info"
              data-style="expand-right"
              v-if="typeAction == 1"
              @click="savePremio()"
            >Guardar</button>
            <button
              slot="button"
              type="button"
              class="btn btn-info"
              data-style="expand-right"
              v-if="typeAction == 2"
              @click="updatePremio()"
            >Actualizar</button>
            <!-- END BUTTONS -->
          </sweet-modal>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import axios from 'axios';
import { SweetModal, SweetModalTab } from "sweet-modal-vue";
import toastr from 'toastr';

export default {
  components: {
    SweetModal,
    SweetModalTab
  },
  name: 'Premios',
  data () {
    return {
      fields: [
        { key: 'nombre', label: 'Nombre', _classes: 'font-weight-bold' },
        { key: 'tipo', label: 'Tipo de premio' },
        { key: 'cantidad', label: 'Premios restantes'},
        { key: 'empresa', label: 'Empresa'},
        { key: 'contacto', label: 'Contacto de empresa'},
        { key: 'estado', label: 'Estado'},
        { key: 'acciones', label: 'Acciones'}
      ],
      activePage: 1,
      items: null,
      titleModal: "",
      typeAction: 1,
      id: '',
      nombre: '',
      fichas: 0,
      tipo: 'Seleccione',
      descripcion: '',
      direccion: '',
      ubicacion: 'Pendiente',
      contacto: '',
      empresa: '',
      vencimiento: '',
      imagen: 'https://res.cloudinary.com/dxj44eizq/image/upload/v1613269259/nivel_1_vtbk4s.png',
      estado: '',
      cantidad: 0,
      errorPremio: 0,
      errorShowMessagePremio: [],
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
    openModal(accion, data = []){
      let me = this;
      me.$refs.nuevo_usuario.open();
      switch (accion) {
        case "register": {
          this.titleModal = "Nuevo Premio";
          this.typeAction = 1;
          break;
        }
        case "update": {
          var venc = this.tomarFecha(data.vencimiento);
          this.titleModal = "Actualizar Premio";
          this.typeAction = 2;
          this.nombre = data.nombre;
          this.id = data._id;
          this.nombre = data.nombre;
          this.fichas = data.fichas;
          this.tipo = data.tipo;
          this.descripcion = data.descripcion;
          this.direccion = data.direccion;
          this.ubicacion = data.ubicacion;
          this.contacto = data.contacto;
          this.empresa = data.empresa;
          this.vencimiento = venc;
          this.imagen = data.imagen;
          this.cantidad = data.cantidad;
          this.ubicacion = data.ubicacion;
          break;
        }
        case 'deactivate':
        {
          
          break
        }
        case 'activate':
        {
          
          break
        }
      }
    },
    tomarFecha(vencimiento){
      var venc = new Date(vencimiento);
      var regresar;
      if ((venc.getMonth()) < 10){
        if(venc.getMonth() === 0){
          regresar = venc.getFullYear() + '-01-' + venc.getDate()
        }
        else{
          regresar = venc.getFullYear() + '-0' + venc.getMonth() + '-' + venc.getDate()
        }
        
      }
      else{
        regresar = venc.getFullYear() + '-' + venc.getMonth() + '-' + venc.getDate()
      }
      return regresar;
    },
    closeModal(){
      this.$refs.nuevo_usuario.close();
      this.nombre = "";

      this.errorPremio = 0;
      this.errorShowMessagePremio = [];
      this.id = '';
      
    },
    savePremio(){
      if (this.validatePremio()){
          return;
      }
      axios.post(`http://localhost:4500/premios/nuevo`,{
        nombre: this.nombre,
        fichas: this.fichas,
        tipo: this.tipo,
        descripcion: this.descripcion,
        direccion: this.direccion,
        ubicacion: 'Pendiente',
        contacto: this.contacto,
        empresa: this.empresa,
        vencimiento: this.vencimiento,
        imagen: 'https://res.cloudinary.com/dxj44eizq/image/upload/v1613269259/nivel_1_vtbk4s.png',
        cantidad: this.cantidad,
      }).then(function (response) {
        toastr.success(response.data.message, 'Listo')
      })
      .catch(function (error) {
        console.log(error);
      })
      this.$forceUpdate();
      this.closeModal();
    },
    updatePremio(){
      if (this.validatePremio()){
          return;
      }
      axios.post(`http://localhost:4500/premios/actualizar`,{
        _id: this.id,
        nombre: this.nombre,
        fichas: this.fichas,
        tipo: this.tipo,
        descripcion: this.descripcion,
        direccion: this.direccion,
        ubicacion: 'Pendiente',
        contacto: this.contacto,
        empresa: this.empresa,
        vencimiento: this.vencimiento,
        imagen: 'https://res.cloudinary.com/dxj44eizq/image/upload/v1613269259/nivel_1_vtbk4s.png',
        cantidad: this.cantidad,
      }).then(function (response) {
         toastr.success(response.data, "Listo");
      })
      .catch(function (error) {
        console.log(error)
      })
      this.closeModal();
      this.$forceUpdate();
    },
    validatePremio(){
      this.errorPremio = 0;
      this.errorShowMessagePremio = [];
      if (!this.nombre) this.errorShowMessagePremio.push('El nombre de usuario no puede estar vacío');
      if (this.rol === "Seleccione") this.errorShowMessagePremio.push('Por favor seleccione un tipo de premio');
      

      if (this.errorShowMessagePremio.length) this.errorPremio = 1;
      return this.errorPremio;
    },
    getBadge (estado) {
      switch (estado) {
        case 'Activo': return 'success'
        case 'Inactivo': return 'danger'
        default: 'primary'
      }
    },
    pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
    getPremios(){
      let me = this;
      var response = axios.get(`http://localhost:4500/premios2`)
      .then(function (response) {
        me.items = response.data
      })
      .catch(function (error) {
          console.log(error);
      })
      .then(function () {
      });
      
    },
  },
  mounted(){
    this.getPremios();
  },
}
</script>
