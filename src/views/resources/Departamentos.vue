<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>
          <div>Departamentos</div>
        </CCardHeader>
        <br />
        <CCol col="2" sm="2" md="2" xl class="mb-3 mb-xl-0">
          <CButton @click="openModal('register', '')" color="info"
            >Nuevo</CButton
          >
        </CCol>
        <br />
        <template>
          <div class="col-md-12">
            <div class="input-group">
              <select class="form-control col-md-4">
                <option value="nombre">Nombre</option>
              </select>
              <input
                type="text"
                v-model="buscar"
                class="form-control"
                placeholder="Ingrese el nombre del departamento que desea buscar"
              />

              <button
                @click="listarDepartamentos(buscar)"
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
                  <button
                    @click="openModal('ver', data.item)"
                    class="btn btn-warning"
                  >
                    Ver Municipios
                  </button>
                </div>
              </td>
            </template>
          </CDataTable>
          <sweet-modal
            ref="nuevo_departamento"
            :title="titleModal"
            hide-close-button
            blocking
          >
            <!-- START FORM -->
            <div class="form-group">
              <CInput
                label="Nombre"
                placeholder="Ingresa el nombre"
                v-model="nombre"
              />

              <CCard
                v-show="errorDep"
                color="danger"
                class="text-center"
                body-wrapper
                text-color="white"
              >
                <blockquote
                  v-for="error in errorShowMessageDep"
                  :key="error"
                  v-text="error"
                  class="card-blockquote"
                ></blockquote>
              </CCard>
            </div>

            <!-- END FORM -->
            <!-- START BUTTONS -->
            <button
              slot="button"
              type="button"
              class="btn btn-danger"
              @click="closeModal()"
            >
              Cancelar
            </button>
            <button
              slot="button"
              type="button"
              class="btn btn-info"
              data-style="expand-right"
              v-if="typeAction == 1"
              @click="saveDepartamento()"
            >
              Guardar
            </button>
            <button
              slot="button"
              type="button"
              class="btn btn-info"
              data-style="expand-right"
              v-if="typeAction == 2"
              @click="updateDep()"
            >
              Actualizar
            </button>
            <!-- END BUTTONS -->
          </sweet-modal>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import axios from "axios";
import { SweetModal, SweetModalTab } from "sweet-modal-vue";

export default {
  components: {
    SweetModal,
    SweetModalTab,
  },
  name: "Users",
  data() {
    return {
      fields: [
        { key: "departamento", label: "Nombre", _classes: "font-weight-bold" },
        { key: "acciones", label: "Acciones" },
      ],
      activePage: 1,
      items: null,
      titleModal: "",
      typeAction: 1,
      id: "",
      nombre: "",
      errorDep: 0,
      errorShowMessageDep: [],
      tituloModalActivar: "",
      buscar: "",
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
          me.$refs.nuevo_departamento.open();
          this.titleModal = "Nuevo Departamento";
          this.typeAction = 1;
          break;
        }
        case "update": {
          me.$refs.nuevo_departamento.open();
          this.titleModal = "Actualizar Departamento";
          this.typeAction = 2;
          this.nombre = data.departamento;
          this.id = data._id;
          break;
        }
        case "ver": {
          //Aqui se abre un listado de los municipios
          me.$refs.nuevo_departamento.open();
          this.titleModal = "Actualizar Departamento";
          this.typeAction = 2;
          this.nombre = data.departamento;
          this.id = data._id;
          break;
        }
      }
    },
    closeModal() {
      this.$refs.nuevo_departamento.close();
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
        .get(`https://secret-brushlands-88440.herokuapp.com/departamentos`) //
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
    listarDepartamentos(buscar) {
      let me = this;
      if (buscar === "") {
        setTimeout(() => me.get(), 1000);
      } else {
        var response = axios
          .get(
            `https://secret-brushlands-88440.herokuapp.com/departamentos/${buscar}`
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
    saveDepartamento() {
      if (this.nombre === "") {
        return;
      }
      let me = this;
      axios
        .post(
          `https://secret-brushlands-88440.herokuapp.com/crear-departamento/`,
          {
            departamento: this.nombre,
          }
        )
        .then(function (response) {
          me.items = null;
          setTimeout(() => me.getDepartamentos(), 1000);
        })
        .catch(function (error) {
          console.log(error);
        });
      this.closeModal();
    },
    updateDep() {
      if (this.nombre === "") {
        return;
      }
      let me = this;
      axios
        .post(
          `https:/secret-brushlands-88440.herokuapp.com/actualizar-departamento/`,
          {
            _id: this.id,
            departamento: this.nombre,
          }
        )
        .then(function (response) {
          me.items = null;
          setTimeout(() => me.getDepartamentos(), 1000);
        })
        .catch(function (error) {
          console.log(error);
        });
      this.closeModal();
    },
  },
  mounted() {
    this.getDepartamentos();
  },
};
</script>
