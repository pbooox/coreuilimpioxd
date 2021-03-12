<template>
  <CRow>
    <CCol col="12" xl="8">
      <CCard>
        <CCardHeader>
          Imagen
        </CCardHeader>
        <template>

          <div class="col-md-12">
              <div class="input-group">
                  <select class="form-control col-md-4" v-model="criterio">
                      <option value="nombre">Nombre</option>
                      <option value="numero">Numero</option>
                  </select>
                  <input type="text" v-model="buscar" class="form-control" placeholder="Ingrese el criterio que desea buscar">

                  <button @click="listarImagenes(buscar, criterio)" type="submit" class="btn btn-info"> Buscar</button>
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
          
          <template #imagenes="data">
            <img :src=data.item.urlC class="img-responsive" height="70" width="46">
          </template>
          <template #acciones="data">
            <td>

              <div class="btn-group mr-2"
                role="group"
                aria-label="First group"
              >
                <button @click="openModal('update', data.item)" class="btn btn-info">Editar</button>
              </div>
            </td>
          </template>
          </CDataTable>
          <sweet-modal ref="nuevo_usuario" :title="titleModal" hide-close-button blocking>
            <!-- START FORM -->
            <div class="form-group">
              <label>Imagen actual</label><br>
              <img :src=imagenPrevia class="img-responsive" height="140" width="92">
              <div>
                <br>
              </div>
              <label>Imagen nueva</label><br>
              <input type="file" @change="processFile($event)" />
              <div>
                <br>
              </div>
              
              
              <CCard v-show="errorImagen" color="danger" class="text-center" body-wrapper text-color="white">
                <blockquote v-for="error in errorShowMessageImagen" :key="error" v-text="error" class="card-blockquote">
                  
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
              v-if="typeAction == 2"
              :disabled = btnGuardar
              @click="updateImagen()"
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

export default {
   components: {
    SweetModal,
    SweetModalTab
  },
  name: 'Imagen',
  data () {
    return {
      fields: [
        { key: 'id', label: 'Número', _classes: 'font-weight-bold' },
        { key: 'nombre', label: 'Nombre'},
        { key: 'registro' },
        { key: 'imagenes', label: 'Imagen' },
        { key: 'acciones', label: 'Acciones'}
      ],
      activePage: 1,
      items: null,
      titleModal: "",
      typeAction: 1,
      errorImagen: 0,
      errorShowMessageImagen: [],
      id: '',
      imagen: '',
      imagenPrevia: '',
      btnGuardar: true,
      url_imagen: '',
      CLOUDINARY_URL: 'https://api.cloudinary.com/v1_1/dxj44eizq/image/upload',
      CLOUDINARY_UPLOAD_PRESET: 'pw39sleo',
      buscar: '',
      criterio: 'nombre',
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
    getBadge (status) {
      switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'secondary'
        case 'Pending': return 'warning'
        case 'Banned': return 'danger'
        default: 'primary'
      }
    },
    rowClicked (item, index) {
      this.$router.push({path: `users/${index + 1}`})
    },
    pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
    processFile(event) {
      this.imagen = event.target.files[0];
      this.GuardarImagen();
    },
    GuardarImagen() {
      let formData = new FormData();
      formData.append("file", this.imagen); // le damos los datos de la imagen luego que se lleno en la funcion processFile()
      formData.append("upload_preset", this.CLOUDINARY_UPLOAD_PRESET); // le damos nuestro preset
      //subiendo imagen con fetch
      fetch(this.CLOUDINARY_URL, { method: "POST", body: formData })
        .then(response => response.json()) //convertimos la respuesta en json
        .then(data => this.AsignarURL(data.secure_url))// obtenemos la url de la imagen guardada
        .catch(error => console.log("ocurrio un error " , error)); //capturamos un posible error
    },
    AsignarURL(url){
      setTimeout(() => this.btnGuardar = false, 1000);
      this.url_imagen = url;
    },
    openModal(accion, data = []){
      let me = this;
      
      switch (accion) {
        case "update": {
          me.$refs.nuevo_usuario.open();
          this.titleModal = "Actualizar Premio";
          this.typeAction = 2;
          this.id = data._id;
          this.imagen = data.urlC;
          this.imagenPrevia = data.urlC;
          break;
        }
      }
    },
    closeModal(){
      this.$refs.nuevo_usuario.close();
      this.id = '';
      this.imagen = '';
      this.errorImagen = 0;
      this.errorShowMessageImagen = [];
      this.btnGuardar = true;
    },
    updateImagen(){
      if (this.validateImagen()){
        return;
      }
      let me = this;
      axios.post(`https://secret-brushlands-88440.herokuapp.com/imagenes/actualizar`,{
        _id: this.id,
        imagen: this.url_imagen,
      }).then(function (response) {
        console.log('listo')
        me.items = null;
        setTimeout(() => me.getImagenes(), 1000);
      })
      .catch(function (error) {
        console.log(error)
      })
      this.closeModal();
    },
    validateImagen(){
      this.errorImagen = 0;
      this.errorShowMessageImagen = [];
      if (this.imagenPrevia === this.imagen) this.errorShowMessageImagen.push('La imagen no cambió');
      

      if (this.errorShowMessageImagen.length) this.errorImagen = 1;
      return this.errorImagen;
    },
    getImagenes(){
      let me = this;
      var response = axios.get(`https://secret-brushlands-88440.herokuapp.com/imagenes`)
      .then(function (response) {
        me.items = response.data
      })
      .catch(function (error) {
          console.log(error);
      })
      .then(function () {
      });
      
    },
    listarImagenes(buscar, criterio){
      let me = this;
      if(buscar === ''){
        setTimeout(() => me.getImagenes(), 1000);
      }
      else{
        var response = axios.get(`http://localhost:4500/imagenes/criterios/${buscar}/${criterio}`)
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
    this.getImagenes();
  },
}
</script>
