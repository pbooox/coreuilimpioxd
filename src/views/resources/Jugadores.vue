<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <div>Jugadores</div>
        </CCardHeader>

        <br>
        <template>

          <div class="col-md-12">
              <div class="input-group">
                  <select class="form-control col-md-4" v-model="criterio">
                      <option value="nombre">Nombre</option>
                      <option value="correo">Correo</option>
                  </select>
                  <input type="text" v-model="buscar" class="form-control" placeholder="Ingrese el criterio que desea buscar">

                  <button @click="listarJugadores(buscar, criterio)" type="submit" class="btn btn-info"> Buscar</button>
              </div>
          </div>

        </template>
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
            
          </CDataTable>

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
        { key: 'maiz_amarillo', label: 'Maíces amarillos'},
        { key: 'maiz_morado', label: 'Maíces morados'},
        { key: 'maiz_blanco', label: 'Maíces blancos'},
        { key: 'maiz_rojo', label: '´Maíces rojos'},
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
      buscar: '',
      criterio: 'nombre',
      total: 0
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
    getJugadores(){
      let me = this;
      var response = axios.get(`https://api-loteria-heroku.herokuapp.com/listado_de_usuarios`) //
      .then(function (response) {
        //console.log(response.data)
        me.items = response.data
        me.total = me.items.length
      })
      .catch(function (error) {
          console.log(error);
      })
      .then(function () {
      });
      
    },
    listarJugadores(buscar, criterio){
      let me = this;
      if(buscar === ''){
        setTimeout(() => me.getUsuarios(), 1000);
      }
      else{
        var response = axios.get(`https://secret-brushlands-88440.herokuapp.com/usuarios/criterios/${buscar}/${criterio}`)
        .then(function (response) {
          me.items = response.data
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
        });
      }
    },
  },
  mounted(){
    this.getJugadores();
  },
}
</script>
