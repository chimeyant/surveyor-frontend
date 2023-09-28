import Vue from "vue";
import VueRouter from "vue-router";
import BaseFrontend from "../views/frontend/Base.vue";
import Auth from "../providers/AuthProviders";
import Login from "../views/frontend/Login.vue";
import Home from "../views/frontend/Home.vue";

//BASE APLIKASI
import Base from "../views/backend/Base.vue";

//Dashboard Page
import Dashboard from "../views/backend/pages/Dashboard.vue";

//Utiity Group Page
import User from "../views/backend/pages/utility/user/Index.vue";
import Changepwd from "../views/backend/pages/utility/user/Changepwd.vue";
import ProfilAkun from "../views/backend/pages/utility/user/Profil.vue";
import UtilityManajemenFitur from "../views/backend/pages/utility/manajemenfitur/Index.vue";
import UtilitymanajemenFiturAdministrator from "../views/backend/pages/utility/manajemenfitur/administrator/Index.vue";
import UtilityUpdateHistory from "../views/backend/pages/utility/updatehistory/Index.vue";
import UtilityUpdateHistoryItem from "../views/backend/pages/utility/updatehistory/items/Index.vue";

//page master data
import MasterAppInfo from "../views/backend/pages/masterdata/appinfo/Index.vue";
import MasterSekolah from "../views/backend/pages/masterdata/sekolah/Index.vue";
import MasterJenis from "../views/backend/pages/masterdata/jenis/Index.vue";
import MasterQuestion from "../views/backend/pages/masterdata/jenis/question/Index.vue";

//page aktifitas
import Aktifitas from "../views/backend/pages/aktifitas/Index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    name: "",
    component: BaseFrontend,
    children: [
      { path: "", redirect: { name: "login" } },
      { path: "home", name: "home", component: Home },
      { path: "login", name: "login", component: Login },
    ],
  },

  /**
   * Route Backend
   */

  {
    path: "/backend",
    name: "",
    meta: {
      auth: true,
    },
    component: Base,
    children: [
      { path: "", redirect: { name: "dashboard" } },
      { path: "dashboard", name: "dashboard", component: Dashboard },
      { path: "user", name: "user", component: User },
      {
        path: "chngpwd",
        name: "chngpwd",
        component: Changepwd,
      },
      {
        path: "profil-akun",
        name: "profil-akun",
        component: ProfilAkun,
      },
      //route master data
      {
        path: "master-app-info",
        name: "master-app-info",
        component: MasterAppInfo,
      },
      {
        path: "master-sekolah",
        name: "master-sekolah",
        component: MasterSekolah,
      },
      {
        path: "master-jenis",
        name: "master-jenis",
        component: MasterJenis,
      },
      {
        path: "master-question/:master_type_uuid",
        name: "master-question",
        component: MasterQuestion,
      },

      /**
       *
       * Route Aktifitas
       */
      {
        path: "aktifitas",
        name: "aktifitas",
        component: Aktifitas,
      },

      /**
       * Route Utility
       */
      {
        path: "utility-manajemen-fitur-administrator",
        name: "utility-manajemen-fitur-administrator",
        component: UtilitymanajemenFiturAdministrator,
      },
      {
        path: "utility-manajemen-fitur",
        name: "utility-manajemen-fitur",
        component: UtilityManajemenFitur,
      },
      {
        path: "utility-update-history",
        name: "utility-update-history",
        component: UtilityUpdateHistory,
      },
      {
        path: "utility-update-history-items/:update_history_id",
        name: "utility-update-history-items",
        component: UtilityUpdateHistoryItem,
      },
    ],
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
  mode: "history",
});

/**
 * router match
 */

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.auth);

  if (requiresAuth) {
    if (!Auth.check) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    if (to.name === "login" && Auth.check) {
      if (Auth.user.authent == "superadmin") {
        next({ name: "dashboard" });
      } else if (Auth.user.auth === "administrator") {
        next({ name: "dashboard" });
      } else {
        next({ name: "dashboard" });
      }
    } else {
      next();
    }
  }
});

export default router;
