<template>
  <v-app>
    <v-content>
      <v-container>
        <v-toolbar flat color="white">
          <v-toolbar-title>
            <v-list class="pa-0">
              <v-list-tile avatar>
                <v-list-tile-avatar color="red">
                  <img src="./assets/logo_MOZA.png"/>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    Pré-Registro - MOZA
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-toolbar-title>
          <v-divider class="mx-3" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog
          v-model="dialog"
          max-width="500px"
          transition="dialog-transition"
          persistent="false"
          >
          <v-btn slot="activator" color="primary">Novo Cliente</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">{{ dialogTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                    required
                    v-validate="'required|alpha|max:15'"
                    v-model="dataModel.name"
                    data-vv-name="nome"
                    label="Nome"
                    :error-messages="errors.collect('nome')"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                    required
                    v-validate="'required|alpha|max:15'"
                    v-model="dataModel.surname"
                    data-vv-name="apelido"
                    label="Apelido"
                    :error-messages="errors.collect('apelido')"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select
                    required
                    v-validate="'required'"
                    v-model="dataModel.doctype"
                    data-vv-name="tipodoc"
                    :items="doctype"
                    label="Tipo de documento"
                    :error-messages="errors.collect('tipodoc')"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                    required
                    v-validate="'required|alpha_num'"
                    v-model="dataModel.docnumber"
                    data-vv-name="numerodoc"
                    label="Número do documento"
                    :error-messages="errors.collect('numerodoc')"
                    ></v-text-field>
                  </v-flex> 
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                    required  
                    v-validate="'required|min:12'"
                    v-model="dataModel.msisdn"
                    data-vv-name="phone"
                    label="No. Telemóvel"
                    prepend-icon="phone"     
                    hint="e.g - (258) 8X-XXX-XXXX"
                    :mask="mask"
                    :error-messages="errors.collect('phone')" 
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-text-field
                    required
                    v-validate="'required|email'"
                    v-model="dataModel.email"
                    data-vv-name="email"
                    prepend-icon="email"     
                    label="Email"
                    :error-messages="errors.collect('email')"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select
                    required
                    v-validate="'required'"
                    v-model="dataModel.province"
                    data-vv-name="provincia"
                    :items="province"
                    label="Província"
                    :error-messages="errors.collect('provincia')"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                    <v-select
                    required
                    v-validate="'required'"
                    v-model="dataModel.acctype"
                    data-vv-name="conta"
                    :items="acctype"
                    label="Tipo de Conta"
                    :error-messages="errors.collect('conta')"
                    ></v-select>
                  </v-flex>                   
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" flat @click.native="save">Salvar</v-btn>
            </v-card-actions>
          </v-card>

        </v-dialog>
      </v-toolbar>

      <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      hide-actions
      >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.msisdn }}</td>
        <td>{{ props.item.fullname }}</td>
        <td>{{ props.item.acctype }}</td>
        <td>{{ props.item.doctype }}</td>
        <td>{{ props.item.docnumber }}</td>
        <td>{{ props.item.email }}</td>
        <td>{{ props.item.province }}</td>
        <td>
          <v-icon 
          small 
          class ='mr-2' 
          @click="editSubscriber(props.item)">
          edit
        </v-icon>
        <v-icon 
        small
        @click="deleteSubscriber(props.item)">
        delete
      </v-icon>
    </td>
  </template>
</v-data-table>


<v-snackbar
v-model="notification"
:timeout="6000"
:top="true"
color="success"
>
{{ success }}
<v-btn 
flat 
color="primary" 
@click.native="notification = false"
>Close</v-btn>
</v-snackbar>
</v-container>
</v-content>
</v-app>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      loading: false,
      notification: false,
      success: '',
      dialog: false,
      mask: '(###) ##-###-####',
      acctype: [
      { text: 'Conta Moza Salário'},
      { text: 'Conta Valor Poupança'},
      { text: 'Conta Valor'},
      { text: 'Moza Valor Bonús'},
      { text: 'Conta Moza Mundo'}
      ],
      doctype: [
      { text: 'Bilhete de Identidade'},
      { text: 'Passaporte'},
      { text: 'Cartão de Eleitor'},
      { text: 'Certidão de Nascimento'},
      { text: 'Carta de Condução'},
      { text: 'DIRE'}
      ],
      province: [
      { text: 'Maputo Cidade', value: 'MC'},
      { text: 'Maputo', value: 'MP'},
      { text: 'Inhambane', value: 'INH'},
      { text: 'Gaza', value: 'GAZ'},
      { text: 'Sofala', value: 'SOF'},
      { text: 'Manica', value: 'MAN'},
      { text: 'Tete', value: 'TET'},
      { text: 'Zambézia', value: 'ZAM'},
      { text: 'Nampula', value: 'NAM'},
      { text: 'Niassa', value: 'NIA'},
      { text: 'Cabo Delgado', value: 'CAB'}
      ],
      headers: [
      { text: 'MSISDN', align: 'left', value: 'msisdn'},
      { text: 'Nome', value: 'name'},
      { text: 'Tipo Conta', value: 'acctype'},
      { text: 'Tipo Documento', value: 'doctype'},
      { text: 'No. Documento', value: 'docno'},
      { text: 'E-mail', value: 'email'},
      { text: 'Província', value: 'province'},
      { text: 'Acçōes', value: 'name', sortable: false }
      ],
      items: [],
      dataIndex: -1,
      dataModel: {
        name: '',
        surname: '',
        doctype: '',
        docnumber: '',
        msisdn: '258',
        email: '',
        province: '',
        acctype: ''
      },
    }),

    computed: {
      dialogTitle() {
        return this.dataIndex === -1 ? 'Novo Cliente' : 'Editar Cliente'
      }
    },

    created () {
      this.init()
    },

    methods: {
      init() {
        this.loading = true
        axios.get('http://localhost:3000/accounts').then(response => {
          this.items = response.data.accounts
          this.loading = false
        })
      },
      close() {
        this.$validator.reset()
        this.dataIndex = -1
        this.dataModel = {}
        this.dialog = false
      },
      save() {
        this.$validator.validateAll()
        .then((response) => {
          if (response) {
            if (this.dataIndex > -1) {
              axios.put('http://localhost:3000/accounts/' + this.items[this.dataIndex].id, {
                name: this.dataModel.name,
                surname: this.dataModel.surname,
                doctype: this.dataModel.doctype,
                docnumber: this.dataModel.docnumber,
                msisdn: this.dataModel.msisdn,
                email: this.dataModel.email,
                province: this.dataModel.province,
                acctype: this.dataModel.acctype
              }).then((response) => {
                console.log(response)
                this.dialog = false
                this.success = 'Registro atualizado com sucesso'
                this.notification = true
                this.dataModel = {}
                this.init()
              })
            }
            else {
              axios.post('http://localhost:3000/accounts', {
                name: this.dataModel.name,
                surname: this.dataModel.surname,
                doctype: this.dataModel.doctype,
                docnumber: this.dataModel.docnumber,
                msisdn: this.dataModel.msisdn,
                email: this.dataModel.email,
                province: this.dataModel.province,
                acctype: this.dataModel.acctype
              }).then((response) => {
                console.log(response)
                this.dialog = false
                this.success = 'Registro criado com sucesso'
                this.notification = true
                this.dataModel = {}
                this.init()
              })
            }}
          })
        .catch((error) => {
          console.log(error)
        })
      },
      deleteSubscriber(item) {
       confirm('Confirma a remoção do cliente ' + item.msisdn + '?') &&
       axios.delete('http://localhost:3000/accounts/' + item.id).then((response) => {
        console.log(response)
        this.success = 'Registro do cliente ' + response.data.account.msisdn + ' removido com sucesso'
        this.notification = true
        this.init()
        this.close()
      }).catch((error) => {
        console.log(error)
      })
    },
    editSubscriber(item) {
      this.dataIndex = this.items.indexOf(item)
      this.dataModel = Object.assign({}, item)
      this.dialog = true
    }
  }
}
</script>

<style>
</style>
