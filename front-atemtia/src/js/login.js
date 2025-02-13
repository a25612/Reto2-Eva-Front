export default {
    data() {
      return {
        username: '',
        password: '',
        error: ''
      };
    },
    methods: {
      login() {
        if (this.username === "admin" && this.password === "1234") {
          this.$router.push('/home-app-atemtia');
        } else {
          this.error = "Usuario o contraseña incorrectos";
        }
      }
    }
  };