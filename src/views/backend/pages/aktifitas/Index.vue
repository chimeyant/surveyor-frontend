<template>
  <div :class="device.desktop ? `home pa-6 grey lighten-4`:`home pa-0 grey lighten-4`">
    <v-row>
      <v-col cols="12">
        <v-card class="animated animate__bounceIn rounded-0">
          <v-card-title :class="`flex flex-row-reverse ` + theme.color + ` lighten-1`">
            <v-tooltip
              :color="theme.color"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  small
                  icon
                  v-on="on"
                  class="animate__animated animate__shakeY animate__delay-1s"
                  v-show="page.actions.add"
                  @click="openForm"
                >
                  <v-icon
                    :color="theme.mode == 'dark' ? `white` : `black`"
                    @click=""
                  >add_circle</v-icon>
                </v-btn>
              </template>
              <span>Tambah Data</span>
            </v-tooltip>
            <v-tooltip
              :color="theme.color"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  small
                  icon
                  v-on="on"
                >
                  <v-icon
                    :color="theme.mode == 'dark' ? `white` : `black`"
                    @click="fetchRecords"
                  >refresh</v-icon>
                </v-btn>
              </template>
              <span>Refresh Data</span>
            </v-tooltip>

            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Pencarian"
              single-line
              hide-details
              solo
              dense
              :color="theme.color"
              style="max-width: 350px"
            ></v-text-field>
          </v-card-title>
          <v-data-table
            v-show="device.desktop"
            :headers="headers"
            :items="records"
            :items-per-page="table.options.itemsPerPage"
            :page.sync="table.options.page"
            class="elevation-2 mb-1"
            :color="theme.color"
            :loading="loading.table"
            loading-text="Loading... Please wait"
            :search="search"
            hide-default-footer
            @page-count="table.options.pageCount = $event"
            show-select
          >
            <v-progress-linear
              slot="progress"
              :color="theme.color"
              height="1"
              indeterminate
            ></v-progress-linear>
            <template v-slot:item.progress="{ value }">
              <v-progress-linear
                :color="theme.color"
                v-model="value"
                height="25"
              >
                <strong>{{ value }}%</strong>
              </v-progress-linear>
            </template>
            <template v-slot:item.question="{ value }">
              <div
                class="pt-4"
                v-html="value"
              >

              </div>
            </template>
            <template v-slot:item.status="{ value }">
              <v-chip
                :color="value.color"
                small
              >{{ value.text }}</v-chip>
            </template>
            <template v-slot:item.id="{ value }">
              <v-menu
                bottom
                origin="center center"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    :color="theme.color"
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-dots-vertical-circle-outline
                  </v-icon>
                </template>

                <v-list>

                  <v-divider v-if="page.delete || page.edit"></v-divider>
                  <v-list-item
                    @click="editRecord(value)"
                    v-show="page.actions.edit"
                  >
                    <v-list-item-title>
                      <v-icon color="orange">mdi-pencil-circle</v-icon>
                      Ubah Data
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="postDeleteRecord(value)"
                    v-show="page.actions.delete"
                  >
                    <v-list-item-title>
                      <v-icon color="red">mdi-delete-circle</v-icon>
                      Hapus Data
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
          <v-list
            subheader
            v-show="device.mobile"
          >

            <v-list-item-group
              multiple
              active-class=""
            >
              <v-list-item
                v-for="item in filterItems"
                :key="item.id"
                style="border: ;1px solid"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title
                      class="pt-4"
                      v-html="item.question"
                    ></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-menu
                      bottom
                      origin="center center"
                      transition="scale-transition"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          :color="theme.color"
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-dots-vertical-circle-outline
                        </v-icon>
                      </template>

                      <v-list>

                        <v-divider v-if="page.delete || page.edit"></v-divider>
                        <v-list-item
                          @click="editRecord(item.id)"
                          v-show="page.actions.edit"
                        >
                          <v-list-item-title>
                            <v-icon color="orange">mdi-pencil-circle</v-icon>
                            Ubah Data
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click="postDeleteRecord(item.id)"
                          v-show="page.actions.delete"
                        >
                          <v-list-item-title>
                            <v-icon color="red">mdi-delete-circle</v-icon>
                            Hapus Data
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </template>
              </v-list-item>

            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-col cols="12">
      <v-dialog
        transition="dialog-bottom-transition"
        v-model="form.add"
        :max-width="device.desktop ? `1024px` : `100%`"
        persistent
        :fullscreen="device.mobile"
      >
        <v-card>
          <v-toolbar
            :color="theme.color"
            :dark="theme.mode"
          >
            <v-icon
              small
              class="mr-1 orange--text animate__animated animate__flash animate__infinite"
            >mdi-circle</v-icon> Formulir Data Umpan Balik
          </v-toolbar>
          <v-card-text class="mt-5">
            <v-col col="12">
              <v-select
                label="Pilih Sekolah"
                outlined
                dense
                hide-details
                :color="theme.color"
                v-model="record.master_sekolah_uuid"
                :items="sekolahs"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Tanggal Pelaksanaan"
                outlined
                dense
                hide-details
                v-model="record.implementation_at"
                :color="theme.color"
                type="date"
              ></v-text-field>
            </v-col>
            <v-col cols=12>
              <v-data-table
                v-show="device.desktop"
                :headers="questions.headers"
                :items="questions.records"
                class="elevation-2 mb-1"
                :color="theme.color"
                loading-text="Loading... Please wait"
                hide-default-footer
              >
                <template v-slot:item.question="{ value }">
                  <div v-html="value"></div>
                </template>
                <template v-slot:item.tidak_sesuai="{ value }">
                  <v-text-field
                    label=""
                    outlined
                    dense
                    hide-details
                    v-model="value.nilai"
                    @change="updateQuestionsRecords(value)"
                  ></v-text-field>
                </template>

                <template v-slot:item.sesuai="{ value }">
                  <v-text-field
                    label=""
                    outlined
                    dense
                    hide-details
                    v-model="value.nilai"
                    @change="updateQuestionsRecords(value)"
                  ></v-text-field>
                </template>

                <template v-slot:item.sangat_sesuai="{ value }">
                  <v-text-field
                    label=""
                    outlined
                    dense
                    hide-details
                    v-model="value.nilai"
                    @change="updateQuestionsRecords(value)"
                  ></v-text-field>
                </template>
                <template v-slot:item.id="{ value }">
                  <v-menu
                    bottom
                    origin="center center"
                    transition="scale-transition"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        :color="theme.color"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-dots-vertical-circle-outline
                      </v-icon>
                    </template>
                    <v-list>
                      <v-divider v-if="page.delete || page.edit"></v-divider>
                      <v-list-item @click="">
                        <v-list-item-title>
                          <v-icon color="orange">mdi-pencil-circle</v-icon>
                          Isi Jumlah
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </v-col>

          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-end">
            <v-btn
              outlined
              :color="theme.color"
              v-show="!form.edit"
              @click="postAddNewRecord"
            >Tambah</v-btn>
            <v-btn
              outlined
              :color="theme.color"
              v-show="form.edit"
              @click="postUpdateRecord"
            >Ubah</v-btn>
            <v-btn
              outlined
              color="grey"
              @click="closeForm"
            >Batal</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </div>
</template>
      
  <script>
import { mapActions, mapState } from "vuex";
import "animate.css";
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
} from "tiptap-vuetify";

export default {
  name: "aktivitas",
  components: {
    TiptapVuetify,
  },
  data: () => ({
    num: 1,
    headers: [
      {
        text: "SMK",
        align: "start",
        sortable: false,
        value: "sekolah",
      },
      {
        text: "Tanggal",
        value: "implementation_at",
        width: 100,
        sortable: false,
        align: "center",
      },
      {
        text: "Aksi",
        value: "id",
        width: 100,
        sortable: false,
        align: "center",
      },
    ],
    search: null,
    path: null,
    //Tip Tap Property
    extensions: [
      History,
      Blockquote,
      Bold,
      Strike,
      Italic,
      ListItem,
      BulletList,
      OrderedList,
      [
        Heading,
        {
          options: {
            levels: [1, 2, 3],
          },
        },
      ],

      Paragraph,
    ],
    sekolahs: [],
    questions: {
      headers: [
        {
          text: "Jenis",
          align: "start",
          sortable: false,
          value: "jenis",
          width: 150,
        },
        {
          text: "Pertanyaan",
          align: "start",
          sortable: false,
          value: "question",
        },
        {
          text: "Tidak Sesuai",
          align: "center",
          sortable: false,
          value: "tidak_sesuai",
          width: 100,
        },
        {
          text: "Sesuai",
          align: "center",
          sortable: false,
          value: "sesuai",
          width: 100,
        },
        {
          text: "Sangat Sesuai",
          align: "center",
          sortable: false,
          value: "sangat_sesuai",
          width: 100,
        },
      ],
      records: [],
      record: {},
    },
  }),
  computed: {
    ...mapState([
      "page",
      "theme",
      "http",
      "device",
      "record",
      "records",
      "loading",
      "event",
      "snackbar",
      "table",
      "form",
    ]),
    filterItems() {
      if (this.search != null) {
        return this.records.filter((item) => {
          return (
            item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          );
        });
      } else {
        return this.records;
      }
    },
  },
  created() {
    this.setPage({
      crud: true,
      dataUrl: "api/aktifitas/trx",
      pagination: false,
      title: "DATA UMPAN BALIK",
      subtitle: "Berikut Daftar Data Umpan Balik Yang Tersedia",
      breadcrumbs: [
        {
          text: "Data Master",
          disabled: true,
          href: "",
        },
        {
          text: "Pertanyaan",
          disabled: true,
          href: "#",
        },
      ],
      showtable: true,
      actions: {
        refresh: true,
        add: true,
        edit: false,
        delete: true,
        bulkdelete: false,
        print: false,
        export: false,
        help: false,
      },
    });

    this.fetchRecords().then(() => {
      setTimeout(() => {
        this.table.options.itemsPerPage =
          this.$route.params.itemsPerPage || this.table.options.itemsPerPage;
        this.table.options.page =
          this.$route.params.page || this.table.options.page;
      }, 100);
    });
  },
  mounted() {
    this.getSekolahs();
  },
  methods: {
    ...mapActions([
      "setPage",
      "fetchRecords",
      "postAddNew",
      "postEdit",
      "postUpdate",
      "postConfirmDelete",
      "assignFileBrowse",
      "setLoading",
      "setRecord",
      "setForm",
    ]),
    openForm: function () {
      this.setForm({
        add: true,
        edit: false,
      });
      this.getQuestions();
      this.setRecord({});
    },
    closeForm: function () {
      this.setForm({
        add: false,
        edit: false,
      });
    },
    postAddNewRecord: function () {
      this.record.trxlines = this.questions.records;
      Object.assign(this.record, { trxlines: this.questions.records });
      this.postAddNew(this.record).then(() => {
        this.closeForm();
      });
    },
    editRecord: function (val) {
      this.postEdit(val);
      this.setForm({
        add: true,
        edit: true,
      });
    },
    postUpdateRecord: function () {
      this.postUpdate(this.record).then(() => {
        this.closeForm();
      });
    },
    postDeleteRecord: function (val) {
      this.postConfirmDelete(val);
    },
    postDownload(val) {
      window.open(val, "__blank");
    },

    //custome function
    getSekolahs: async function () {
      try {
        let { data } = await this.http.get("api/combo/sekolah");
        this.sekolahs = data;
      } catch (error) {}
    },

    getQuestions: async function () {
      try {
        let { data } = await this.http.get("api/master-data/pertanyaan-all");
        this.questions.records = data;
      } catch (error) {}
    },

    updateQuestionsRecords: function (payload) {
      const index = this.questions.records.findIndex(
        (item) => item.id === payload.id
      );

      this.questions.records[index][payload.key] = {
        id: payload.id,
        nilai: payload.nilai,
        key: payload.key,
      };
    },
  },
};
</script>