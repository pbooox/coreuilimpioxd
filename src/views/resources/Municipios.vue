<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <div>Municipios</div>
        </CCardHeader>

        <br />
        <template>
          <div class="col-md-12">
            <div class="input-group">
              <select class="form-control col-md-4" v-model="criterio">
                <option value="nombre">Nombre</option>
                <option value="correo">Correo</option>
              </select>
              <input
                type="text"
                v-model="buscar"
                class="form-control"
                placeholder="Ingrese el criterio que desea buscar"
              />

              <button
                @click="listarDepartamentos(buscar, criterio)"
                type="submit"
                class="btn btn-info"
              >
                Buscar
              </button>
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
            :pagination="{ doubleArrows: false, align: 'center' }"
            @page-change="pageChange"
          >
            <template #acciones="data">
              <td>
                <div
                  class="btn-group mr-2"
                  role="group"
                  aria-label="First group"
                >
                  <button
                    @click="openModal('update', data.item)"
                    class="btn btn-info"
                  >
                    Editar
                  </button>
                </div>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import axios from "axios";
import { SweetModal, SweetModalTab } from "sweet-modal-vue";
import toastr from "toastr";

export default {
  components: {
    SweetModal,
    SweetModalTab,
  },
  name: "Users",
  data() {
    return {
      fields: [
        { key: "municipio", label: "Municipio", _classes: "font-weight-bold" },
        { key: "departamento", label: "Departamento" },
        { key: "acciones", label: "Acciones" },
      ],
      activePage: 1,
      items: null,
      titleModal: "",
      typeAction: 1,
      id: "",
      nombre: "",
      errorUser: 0,
      errorShowMessageUser: [],
      tituloModalActivar: "",
      buscar: "",
      criterio: "nombre",
      total: 0,
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page);
        }
      },
    },
  },
  methods: {
    openModal(accion, data = []) {
      let me = this;

      switch (accion) {
        case "register": {
          me.$refs.nuevo_usuario.open();
          this.titleModal = "Nuevo Municipio";
          this.typeAction = 1;
          break;
        }
        case "update": {
          me.$refs.nuevo_usuario.open();
          this.titleModal = "Actualizar Municipio";
          this.typeAction = 2;
          this.nombre = data.nombre;
          this.id = data._id;
          break;
        }
        case "deactivate": {
          me.$refs.activar_modal.open();
          this.tituloModalActivar = "¿Desea desactivar el municipio?";
          this.id = data._id;
          this.typeAction = 3;
          break;
        }
        case "activate": {
          me.$refs.activar_modal.open();
          this.tituloModalActivar = "¿Desea activar el municipio?";
          this.id = data._id;
          this.typeAction = 4;
          break;
        }
      }
    },
    closeModal() {
      this.$refs.nuevo_usuario.close();
      this.$refs.activar_modal.close();
      this.nombre = "";
      this.errorUser = 0;
      this.errorShowMessageUser = [];
      this.id = "";
    },
    getBadge(estado) {
      switch (estado) {
        case "Activo":
          return "success";
        case "Inactivo":
          return "danger";
        default:
          "primary";
      }
    },
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    getDepartamentos() {
      let me = this;
      var response = axios
        .get(`https://secret-brushlands-88440.herokuapp.com/municipios`) //
        .then(function (response) {
          //console.log(response.data)
          me.items = response.data;
          me.total = me.items.length;
        })
        .catch(function (error) {
          console.log(error);
        })
        .then(function () {});
    },
    listarDepartamentos(buscar, criterio) {
      let me = this;
      if (buscar === "") {
        setTimeout(() => me.get(), 1000);
      } else {
        var response = axios
          .get(
            `https://secret-brushlands-88440.herokuapp.com/usuarios/criterios/${buscar}/${criterio}`
          )
          .then(function (response) {
            me.items = response.data;
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function () {});
      }
    },
  },
  mounted() {
    this.getDepartamentos();
  },
};
</script>
