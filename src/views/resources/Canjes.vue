<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <div>Canjes</div>
        </CCardHeader>
        <br>
        <CCol col="2" sm="2" md="2" xl class="mb-3 mb-xl-0">
            <CButton @click="openModal('register', '')" color="info">Reportes</CButton>
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
                <button @click="openModal('deactivate', data.item)" v-if="data.item.estado==='Activo'" class="btn btn-danger">Eliminar cupón</button>
                <button @click="openModal('canjear', data.item)" v-if="data.item.estado==='Activo'" class="btn btn-success">Canjear cupón</button>
                
              </div>
            </td>
          </template>
            
          </CDataTable>


          <sweet-modal ref="nuevo_canje" :title="titleModal" hide-close-button blocking>
            <div v-if="typeAction === 1">
              <p>Este módulo estará disponible próximamente</p>
            </div>
            <!-- <div v-if="typeAction === 1">
              <input type="file" @change="processFile($event)" />
            </div> -->
            <div v-else>
              <!-- START FORM -->
              <div class="form-group">
                <CInput
                  label="Nombre ganador"
                  placeholder="Ingresa el nombre"
                  v-model="nombre"
                />
                <CInput
                  label="Nombre premio"
                  placeholder="Ingresa el nombre del premio"
                  v-model="nombre_premio"
                  disabled
                />
                <CInput
                  label="Correo"
                  placeholder="Ingresa el correo"
                  v-model="correo"
                />
                <CInput
                  label="Departamento"
                  placeholder="Ingresa el departamento"
                  v-model="departamento"
                  disabled
                />
                <CInput
                  label="Descripción"
                  placeholder="Ingresa la descripción"
                  v-model="descripcion"
                />
                
                <div>
                  <br>
                </div>
                <CCard v-show="errorCanje" color="danger" class="text-center" body-wrapper text-color="white">
                  <blockquote v-for="error in errorShowMessageCanje" :key="error" v-text="error" class="card-blockquote">
                    
                  </blockquote>
                </CCard>
              </div>
              
              <!-- END FORM -->
              
            </div>
            <!-- START BUTTONS -->
            <button slot="button" type="button" class="btn btn-danger" @click="closeModal()">Cancelar</button>
            <button
              slot="button"
              type="button"
              class="btn btn-info"
              data-style="expand-right"
              v-if="typeAction == 2"
              @click="updateCanje()"
            >Actualizar</button>
            <!-- END BUTTONS -->
          </sweet-modal>

          <sweet-modal ref="activar_modal" icon="info">
            {{tituloModalActivar}}
            <button
              slot="button"
              type="button"
              class="btn btn-info"
              @click="closeModal()"
            >
              No
            </button>
            <button
              slot="button"
              type="button"
              class="btn btn-danger"
              v-if="typeAction == 3"
              @click="deactivateCanje()"
            >
              Si
            </button>
            <button
              slot="button"
              type="button"
              class="btn btn-success"
              v-if="typeAction == 4"
              @click="activateCanje()"
            >
              Si
            </button>
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
  name: 'Canjes',
  data () {
    return {
      fields: [
        { key: 'nombre', label: 'Nombre cliente', _classes: 'font-weight-bold' },
        { key: 'nombre_premio', label: 'Nombre premio', _classes: 'font-weight-bold'},
        { key: 'departamento', label: 'Departamento'},
        { key: 'correo', label: 'Correo' },
        { key: 'descripcion', label: 'Descripción'},
        { key: 'estado', label: 'Estado'},
        { key: 'acciones', label: 'Acciones'}
      ],
      activePage: 1,
      items: null,
      titleModal: "",
      tituloModalActivar: '',
      typeAction: 1,
      id: '',
      nombre: '',
      nombre_premio: '',
      departamento: '',
      correo: '',
      descripcion: '',
      errorCanje: 0,
      errorShowMessageCanje: [],
      vencimiento: '',
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
      
      switch (accion) {
        case "register": {
          me.$refs.nuevo_canje.open();
          this.titleModal = "¡Atención!";
          this.typeAction = 1;
          break;
        }
        case "update": {
          me.$refs.nuevo_canje.open();
          this.titleModal = "Actualizar Usuario";
          this.typeAction = 2;
          this.nombre = data.nombre;
          this.correo = data.correo;
          this.nombre_premio = data.nombre_premio;
          this.departamento = data.departamento;
          this.descripcion = data.descripcion;
          this.id = data._id;
          this.typeAction = 2;
          break;
        }
        case 'deactivate':
        {
          this.$refs.activar_modal.open();
          this.tituloModalActivar = '¿Desea cancelar el canje?'
          this.id = data._id
          this.typeAction = 3
          break
        }
        case 'activate':
        {
          this.$refs.activar_modal.open();
          this.tituloModalActivar = '¿Desea reactivar el canje?'
          this.id = data._id
          this.typeAction = 4
          break
        }
      }
    },
    closeModal(){
      this.$refs.nuevo_canje.close();
      this.$refs.activar_modal.close();
      this.nombre = "";
      this.correo = '',
      this.errorCanje = 0;
      this.errorShowMessageCanje = [];
      this.id = '';
    },
/*     saveUser(){
      if (this.validateUser()){
          return;
      }
      axios.post(`https://secret-brushlands-88440.herokuapp.com/crear-usuario`,{
        nombre: this.nombre,
        email: this.correo,
        password: this.contra1,
        rol: this.rol,
      }).then(function (response) {
        toastr.success(response.data.message, 'Listo')
      })
      .catch(function (error) {
        console.log(error);
      })
      this.closeModal();
    }, */
    updateCanje(){
      if (this.validateCanje()){
          return;
      }
      let me = this;
      axios.post(`https://secret-brushlands-88440.herokuapp.com/actualizar-canje`,{
        _id: this.id,
        nombre: this.nombre,
        correo: this.correo,
        descripcion: this.descripcion,
        nombre_premio: this.nombre_premio,
        departamento: this.departamento
      }).then(function (response) {
        console.log(response.data)
        toastr.success(response.data, "Listo");
        me.items = null;
        setTimeout(() => me.getCanjes(), 1000);
      })
      .catch(function (error) {
        console.log(error)
      })
      this.closeModal();
    },
    deactivateCanje(){
      let me = this;
      axios.post(`https://secret-brushlands-88440.herokuapp.com/cancelar-canje`,{
        _id: this.id,
      }).then(function (response) {
        toastr.success(response.data, "Listo");
        me.items = null;
        setTimeout(() => me.getCanjes(), 1000);
      })
      .catch(function (error) {
        console.log(error)
      })
      this.closeModal();
    },
    activateCanje(){
      let me = this;
      axios.post(`https://secret-brushlands-88440.herokuapp.com/reactivar-canje`,{
        _id: this.id,
      }).then(function (response) {
        toastr.success(response.data, "Listo");
        me.items = null;
        setTimeout(() => me.getCanjes(), 1000);
      })
      .catch(function (error) {
        console.log(error)
      })
      this.closeModal();
    },
    validateCanje(){
      this.errorCanje = 0;
      this.errorShowMessageCanje = [];
      if (!this.nombre) this.errorShowMessageCanje.push('El nombre de usuario no puede estar vacío');
      if (!this.correo) {
        this.errorShowMessageCanje.push('El correo no puede estar vacío');
      }
      else if (!this.validEmail(this.correo)){
        this.errorShowMessageCanje.push('El correo no es válido');
      }



      if (this.errorShowMessageCanje.length) this.errorCanje = 1;
      return this.errorCanje;
    },
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
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
    getCanjes(){
      let me = this;
      var response = axios.get(`https://secret-brushlands-88440.herokuapp.com/canjes`)
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
    this.getCanjes();
  },
}
</script>
