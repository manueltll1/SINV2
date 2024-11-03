
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: null,
    username: "",
    roles: [],
    permissions: [],
    id: 0
  }),
  persist: true,
  //getters
  actions:{
    setData(token, id, username, roles, permissions){
      this.token = token;
      this.id = id;
      this.username = username;
      this.roles = roles;
      this.permissions = permissions;
    },
    isAuthenticated() {
      return this.token !== null && this.id > 0; // Verifica que el usuario esté autenticado
    }
  }
});