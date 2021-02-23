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
                <button @click="openModal('deactivate', data.item)" v-if="data.item.estado==='Activo'" class="btn btn-danger">Desactivar</button>
                <button @click="openModal('activate', data.item)" v-else class="btn btn-success">Activar</button>
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
                label="Contraseña"
                placeholder="Ingresa la contraseña"
                v-model="contra1"
                type="password"
              />
              <CInput
                label="Comprobar contraseña"
                placeholder="Repite la contraseña"
                v-model="contra2"
                type="password"
              />
              <!-- <CSelect
                label="Rol"
                :options="roles"
                placeholder="Seleccione rol"
                v-model="rol"
              /> -->
              <label>Rol</label>
              <select class="form-control " v-model="rol">
                <option value="Seleccione" disabled>Seleccione...</option>
                <option value="Administrador">Administrador</option>
                <option value="Gestor">Gestor de contenido</option>
              </select>
              <div>
                <br>
              </div>
              <CCard v-show="errorUser" color="danger" class="text-center" body-wrapper text-color="white">
                <blockquote v-for="error in errorShowMessageUser" :key="error" v-text="error" class="card-blockquote">
                  
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
              @click="saveUser()"
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
              @click="deactivateUser()"
            >
              Si
            </button>
            <button
              slot="button"
              type="button"
              class="btn btn-success"
              v-if="typeAction == 4"
              @click="activateUser()"
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
  name: 'Users',
  data () {
    return {
      fields: [
        { key: 'nombre', label: 'Nombre', _classes: 'font-weight-bold' },
        { key: 'email', label: 'Correo' },
        { key: 'rol', label: 'Rol'},
        { key: 'estado', label: 'Estado'},
        { key: 'acciones', label: 'Acciones'}
      ],
      activePage: 1,
      items: null,
      titleModal: "",
      typeAction: 1,
      id: '',
      nombre: '',
      correo: '',
      contra1: '',
      contra2: '',
      rol: 'Seleccione',
      errorUser: 0,
      errorShowMessageUser: [],
      tituloModalActivar: '',
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
          me.$refs.nuevo_usuario.open();
          this.titleModal = "Nuevo Usuario";
          this.typeAction = 1;
          break;
        }
        case "update": {
          me.$refs.nuevo_usuario.open();
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
          me.$refs.activar_modal.open();
          this.tituloModalActivar = '¿Desea desactivar el usuario?'
          this.id = data._id
          this.typeAction = 3
          break;
        }
        case 'activate':
        {
          me.$refs.activar_modal.open();
          this.tituloModalActivar = '¿Desea activar el usuario?'
          this.id = data._id
          this.typeAction = 4
          break
        }
      }
    },
    closeModal(){
      this.$refs.nuevo_usuario.close();
      this.$refs.activar_modal.close();
      this.nombre = "";
      this.contra1 = '',
      this.contra2 = '',
      this.correo = '',
      this.rol = 'Seleccione';
      this.errorUser = 0;
      this.errorShowMessageUser = [];
      this.id = '';
      
    },
    saveUser(){
      if (this.validateUser()){
          return;
      }
      let me = this;
      axios.post(`http://localhost:4500/crear-usuario`,{
        nombre: this.nombre,
        email: this.correo,
        password: this.contra1,
        rol: this.rol,
      }).then(function (response) {
        toastr.success(response.data.message, 'Listo')
        me.items = null;
        setTimeout(() => me.getUsuarios(), 1000);
      })
      .catch(function (error) {
        console.log(error);
      })
      this.closeModal();
    },
    updateUser(){
      if (this.validateUser()){
          return;
      }
      let me = this;
      axios.post(`http://localhost:4500/actualizar-usuario`,{
        _id: this.id,
        nombre: this.nombre,
        email: this.correo,
        password: this.contra1,
        rol: this.rol,
      }).then(function (response) {
        toastr.success(response.data, "Listo");
        me.items = null;
        setTimeout(() => me.getUsuarios(), 1000);
      })
      .catch(function (error) {
        console.log(error)
      })
      this.closeModal();
    },
    deactivateUser(){
      let me = this;
      axios.post(`http://localhost:4500/desactivar-usuario`,{
        _id: this.id,
      }).then(function (response) {
         toastr.success(response.data, "Listo");
        me.items = null;
        setTimeout(() => me.getUsuarios(), 1000);
      })
      .catch(function (error) {
        console.log(error)
      })
      this.closeModal();
    },
    activateUser(){
      let me = this;
      axios.post(`http://localhost:4500/activar-usuario`,{
        _id: this.id,
      }).then(function (response) {
        toastr.success(response.data, "Listo");
        me.items = null;
        setTimeout(() => me.getUsuarios(), 1000);
      })
      .catch(function (error) {
        console.log(error)
      })
      this.closeModal();
    },
    validateUser(){
      this.errorUser = 0;
      this.errorShowMessageUser = [];
      if (!this.nombre) this.errorShowMessageUser.push('El nombre de usuario no puede estar vacío');
      if (!this.correo) {
        this.errorShowMessageUser.push('El correo no puede estar vacío');
      }
      else if (!this.validEmail(this.correo)){
        this.errorShowMessageUser.push('El correo no es válido');
      }
      if (this.contra1 !== this.contra2) this.errorShowMessageUser.push('Las contraseñas no coinciden');
      if ((!this.contra1 || !this.contra2)  && (this.typeAction === 1)) this.errorShowMessageUser.push('No ha ingresado ambos campos de contraseña')
      if (this.rol === "Seleccione") this.errorShowMessageUser.push('Por favor seleccione un rol');

      if (this.errorShowMessageUser.length) this.errorUser = 1;
      return this.errorUser;
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
    getUsuarios(){
      let me = this;
      var response = axios.get(`http://localhost:4500/usuarios`)
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
    this.getUsuarios();
  },
}
</script>
