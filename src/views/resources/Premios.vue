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
        <br>
        <template>

          <div class="col-md-12">
              <div class="input-group">
                  <select class="form-control col-md-4" v-model="criterio">
                      <option value="nombre">Nombre</option>
                      <option value="tipo">Tipo de premio</option>
                      <option value="departamento">Departamento</option>
                      <option value="empresa">Empresa</option>
                  </select>
                  <input type="text" v-model="buscar" class="form-control" placeholder="Ingrese el criterio que desea buscar">

                  <button @click="listarPremios(buscar, criterio)" type="submit" class="btn btn-info"> Buscar</button>
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

          <template #departamento="data">
            <td>
              <label><strong>
                {{getBadge2(data.item.departamento)}}
              </strong></label>
            </td>
          </template>

          <template #imagenes="data">
            <img :src=data.item.imagen class="img-responsive" height="84" width="97">
          </template>

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
                <button @click="openModal('deactivate', data.item)" v-if="data.item.estado==='Activo'" class="btn btn-danger">Eliminar</button>
              </div>
            </td>
          </template>
            
          </CDataTable>


          <sweet-modal ref="nuevo_usuario" width="75%" :title="titleModal" hide-close-button blocking>
            <!-- START FORM -->
            <div class="card-form">
              <div class="form-group">
                <CInput
                  label="Nombre"
                  placeholder="Ingresa el nombre"
                  v-model="nombre"
                />
                <label>Imagen</label><br>
                <input type="file" @change="processFile($event)" />
                <div>
                  <br>
                </div>
                <CInput
                  label="Cantidad de premios disponibles"
                  placeholder="Ingresa la cantidad de premios"
                  v-model="cantidad"
                  type="number"
                  min="0"
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
                <label>Departamento</label>
                <select class="form-control " v-model="departamento">
                  <option value="" disabled>Seleccione...</option>
                  <option value="xela">Xela</option>
                  <option value="guate">Guate</option>
                  <option value="reu">Reu</option>
                  <option value="mazate">Mazate</option>
                  <option value="huehue">Huehue</option>
                  <option value="toto">Toto</option>
                  <option value="san_marcos">San Marcos</option>
                </select>
              </div>
              <div class="form-group">
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



                  <!-- <input @click="habilitarBoton()" v-model="btnGuardar2" type="checkbox">
                  <label>Usar imagen previa</label> -->

              </div>
                
            </div>
            <CCard v-show="errorPremio" color="danger" class="text-center" body-wrapper text-color="white">
              <blockquote v-for="error in errorShowMessagePremio" :key="error" v-text="error" class="card-blockquote">
                
              </blockquote>
            </CCard>
            
            <!-- END FORM -->
            <!-- START BUTTONS -->
            <button slot="button" type="button" class="btn btn-danger" @click="closeModal()">Cancelar</button>
            <button
              slot="button"
              type="button"
              class="btn btn-info"
              data-style="expand-right"
              v-if="typeAction == 1"
              :disabled="btnGuardar"
              @click="savePremio()"
            >Guardar</button>
            <button
              slot="button"
              type="button"
              class="btn btn-info"
              data-style="expand-right"
              v-if="typeAction == 2"
              :disabled="btnGuardar"
              @click="updatePremio()"
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
              @click="deactivatePremio()"
            >
              Si
            </button>
            <button
              slot="button"
              type="button"
              class="btn btn-success"
              v-if="typeAction == 4"
              @click="activatePremio()"
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
  name: 'Premios',
  data () {
    return {
      fields: [
        { key: 'nombre', label: 'Nombre', _classes: 'font-weight-bold' },
        { key: 'tipo', label: 'Tipo de premio' },
        { key: 'cantidad', label: 'Premios restantes'},
        { key: 'departamento', label: 'Departamento'},
        { key: 'empresa', label: 'Empresa'},
        { key: 'contacto', label: 'Contacto de empresa'},
        { key: 'imagenes', label: 'Imagen' },
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
      fichas: 0,
      tipo: 'Seleccione',
      departamento: '',
      descripcion: '',
      direccion: '',
      ubicacion: 'Pendiente',
      contacto: '',
      empresa: '',
      vencimiento: '',
      imagen: '',
      url_imagen: '',
      estado: '',
      mismaImagen: true,
      checkboxmanual: false,
      cantidad: 0,
      errorPremio: 0,
      errorShowMessagePremio: [],
      CLOUDINARY_URL: 'https://api.cloudinary.com/v1_1/dxj44eizq/image/upload',
      CLOUDINARY_UPLOAD_PRESET: 'pw39sleo',
      btnGuardar: true,
      imagenPrevia: '',
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
    processFile(event) {
      this.imagen = event.target.files[0];
      this.GuardarImagen();
    },
    GuardarImagen() {
      this.btnGuardar = true;
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
        case "register": {
          me.$refs.nuevo_usuario.open();
          this.titleModal = "Nuevo Premio";
          this.typeAction = 1;
          break;
        }
        case "update": {
          me.$refs.nuevo_usuario.open();
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
          this.imagenPrevia = data.imagen;
          this.cantidad = data.cantidad;
          this.ubicacion = data.ubicacion;
          this.departamento = data.departamento;
          this.btnGuardar = false;
          break;
        }
        case 'deactivate':
        {
          this.$refs.activar_modal.open();
          this.tituloModalActivar = '¿Desea eliminar el cupón?'
          this.id = data._id
          this.typeAction = 3
          break;
        }
        case 'activate':
        {
          this.$refs.activar_modal.open();
          this.tituloModalActivar = '¿Desea reactivar el canje?'
          this.id = data._id
          this.typeAction = 4
          break;
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
      this.$refs.activar_modal.close();
      this.nombre = "";
      this.id = '';
      this.nombre = '';
      this.fichas = 0;
      this.tipo = 'Seleccione';
      this.departamento = '';
      this.descripcion = '';
      this.direccion = '';
      this.ubicacion = '';
      this.contacto = '';
      this.empresa = '';
      this.vencimiento = '';
      this.imagen = '';
      this.cantidad = 0;
      this.ubicacion = '';
      this.errorPremio = 0;
      this.errorShowMessagePremio = [];
      this.id = '';
      
    },
    cambiarImagen(){
      if(this.checkboxmanual === false){
        this.mismaImagen === true;
      }
      else{
        this.mismaImagen === false;
      }
    },
    savePremio(){
      if (this.validatePremio()){
        return;
      }
      let me = this;
      axios.post(`https://secret-brushlands-88440.herokuapp.com/premios/nuevo`,{
        nombre: this.nombre,
        fichas: this.fichas,
        tipo: this.tipo,
        descripcion: this.descripcion,
        direccion: this.direccion,
        ubicacion: 'Pendiente',
        contacto: this.contacto,
        empresa: this.empresa,
        vencimiento: this.vencimiento,
        imagen: this.url_imagen,
        cantidad: this.cantidad,
        departamento: this.departamento,
      }).then(function (response) {
        toastr.success(response.data.message, 'Listo');
        console.log(response.data.message)
        me.items = null;
        setTimeout(() => me.getPremios(), 1000);
      })
      .catch(function (error) {
        console.log(error);
      })
      this.closeModal();
    },
    updatePremio(){
      if (this.validatePremio()){
          return;
      }
      let me = this;
      axios.post(`https://secret-brushlands-88440.herokuapp.com/premios/actualizar`,{
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
        imagen: this.url_imagen,
        departamento: this.departamento,
        cantidad: this.cantidad,
      }).then(function (response) {
         toastr.success(response.data, "Listo");
        me.items = null;
        setTimeout(() => me.getPremios(), 1000);
      })
      .catch(function (error) {
        console.log(error)
      })
      this.closeModal();
    },
    deactivatePremio(){
      let me = this;
      axios.post(`https://secret-brushlands-88440.herokuapp.com/desactivar-premio`,{
        _id: this.id,
      }).then(function (response) {
        toastr.success(response.data, "Listo");
        me.items = null;
        setTimeout(() => me.getPremios(), 1000);
      })
      .catch(function (error) {
        console.log(error)
      })
      this.closeModal();
    },
    validatePremio(){
      this.errorPremio = 0;
      this.errorShowMessagePremio = [];
      if (!this.nombre) this.errorShowMessagePremio.push('El nombre de usuario no puede estar vacío');
      if (this.departamento === '') this.errorShowMessagePremio.push('El departamento es obligatorio');
      if (this.cantidad === 0) this.errorShowMessagePremio.push('La cantidad de premios no puede ser cero');
      if (this.fichas === 0) this.errorShowMessagePremio.push('La cantidad de fichas no puede ser cero');
      if (!this.vencimiento) this.errorShowMessagePremio.push('El vencimiento del premio es obligatorio');
      if (this.empresa === '') this.errorShowMessagePremio.push('La empresa es obligatoria')
      if (this.contacto === '') this.errorShowMessagePremio.push('El contacto es obligatorio')
      if (this.direccion === '') this.errorShowMessagePremio.push('La dirección es obligatoria')
      if (this.tipo === 'Seleccione') this.errorShowMessagePremio.push('Seleccione un tipo de premio')
      if (this.url_imagen == ''){ this.url_imagen = this.imagen}
      

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
    getBadge2 (departamento) {
      switch (departamento) {
        case 'xela': return 'Xela'
        case 'san_marcos': return 'San Marcos'
        case 'guate': return 'Guate'
        case 'reu': return 'Reu'
        case 'mazate': return 'Mazate'
        case 'huehue': return 'Huehue'
        case 'toto': return 'Toto'
      }
    },
    pageChange (val) {
      this.$router.push({ query: { page: val }})
    },
    getPremios(){
      let me = this;
      var response = axios.get(`https://secret-brushlands-88440.herokuapp.com/premios2`)
      .then(function (response) {
        me.items = response.data
      })
      .catch(function (error) {
          console.log(error);
      })
      .then(function () {
      });
      
    },
    listarPremios(buscar, criterio){
      let me = this;
      if(buscar === ''){
        setTimeout(() => me.getImagenes(), 1000);
      }
      else{
        var response = axios.get(`https://secret-brushlands-88440.herokuapp.com/premios/criterios/${buscar}/${criterio}`)
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
    this.getPremios();
  },
}
</script>
