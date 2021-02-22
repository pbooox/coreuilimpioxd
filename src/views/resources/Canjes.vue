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
                <button v-if="data.item.estado==='Activo'" class="btn btn-success">Canjear</button>
                <button v-else class="btn btn-danger">Cancelar cupón</button>
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
                label="Correo"
                placeholder="Ingresa el correo"
                v-model="correo"
              />
              <CInput
                label="Descripción"
                placeholder="Ingresa la descripción"
                v-model="descripcion"
              />
              <!-- <label>Rol</label>
              <select class="form-control " v-model="rol">
                <option value="Seleccione" disabled>Seleccione...</option>
                <option value="Administrador">Administrador</option>
                <option value="Gestor">Gestor de contenido</option>
              </select> -->
              <div>
                <br>
              </div>
              <CCard v-show="errorDescripcion" color="danger" class="text-center" body-wrapper text-color="white">
                <blockquote v-for="error in errorShowMessageCanje" :key="error" v-text="error" class="card-blockquote">
                  
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
              
            >Guardar</button>
            <button
              slot="button"
              type="button"
              class="btn btn-info"
              data-style="expand-right"
              v-if="typeAction == 2"
              @click="updateUser()"
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
  name: 'Users',
  data () {
    return {
      fields: [
        { key: 'nombre', label: 'Nombre', _classes: 'font-weight-bold' },
        { key: 'correo', label: 'Correo' },
        { key: 'descripcion', label: 'Descripción'},
        { key: 'acciones', label: 'Acciones'}
      ],
      activePage: 1,
      items: null,
      titleModal: "",
      typeAction: 1,
      id: '',
      nombre: '',
      correo: '',
      descripcion: '',
      errorDescripcion: 0,
      errorShowMessageCanje: [],
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
          this.correo = data.email;
          this.rol = data.rol;
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
      this.correo = '',
      this.errorDescripcion = 0;
      this.errorShowMessageCanje = [];
      this.id = '';
      
    },
/*     saveUser(){
      if (this.validateUser()){
          return;
      }
      axios.post(`http://localhost:4500/crear-usuario`,{
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
      this.$forceUpdate();
      this.closeModal();
    }, */
    updateUser(){
      if (this.validateUser()){
          return;
      }
      axios.post(`http://localhost:4500/actualizar-usuario`,{
        _id: this.id,
        nombre: this.nombre,
        email: this.correo,
        password: this.contra1,
        rol: this.rol,
      }).then(function (response) {
        console.log(response.data)
         toastr.success(response.data, "Listo");
      })
      .catch(function (error) {
        console.log(error)
      })
      this.closeModal();
      this.$forceUpdate();
    },
    validateUser(){
      this.errorDescripcion = 0;
      this.errorShowMessageCanje = [];
      if (!this.nombre) this.errorShowMessageCanje.push('El nombre de usuario no puede estar vacío');
      if (!this.correo) {
        this.errorShowMessageCanje.push('El correo no puede estar vacío');
      }
      else if (!this.validEmail(this.correo)){
        this.errorShowMessageCanje.push('El correo no es válido');
      }
      if (this.contra1 !== this.contra2) this.errorShowMessageCanje.push('Las contraseñas no coinciden');
      if (!this.contra1 || !this.contra2) this.errorShowMessageCanje.push('No ha ingresado ambos campos de contraseña')
      if (this.rol === "Seleccione") this.errorShowMessageCanje.push('Por favor seleccione un rol');

      if (this.errorShowMessageCanje.length) this.errorDescripcion = 1;
      return this.errorDescripcion;
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
      var response = axios.get(`http://localhost:4500/canjes`)
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
