<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <div>Usuarios</div>
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
      tipo: '',
      descripcion: '',
      direccion: '',
      ubicacion: '',
      contacto: '',
      empresa: '',
      vencimiento: '',
      imagen: '',
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
          this.titleModal = "Nuevo Usuario";
          this.typeAction = 1;
          break;
        }
        case "update": {
          this.titleModal = "Actualizar Usuario";
          this.typeAction = 2;
          this.nombre = data.nombre;
          this.id = data._id;
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
      axios.post(`http://localhost:4500/crear-usuario`,{
        nombre: this.nombre,
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
      axios.post(`http://localhost:4500/actualizar-usuario`,{
        _id: this.id,
        nombre: this.nombre,
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
      

      if (this.errorShowMessagePremio.length) this.errorPremio = 1;
      return this.errorPremio;
    },
    getBadge (estado) {
      switch (estado) {
        case 'true': return 'success'
        case 'false': return 'danger'
        default: 'primary'
      }
    },
    pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
    getPremios(){
      let me = this;
      var response = axios.get(`http://localhost:4500/premios`)
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
