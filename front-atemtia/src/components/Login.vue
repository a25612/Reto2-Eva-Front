<template>
    <div class="login-container">
    <div class="logo">
      <img src="https://www.atades.org/wp-content/uploads/2021/10/atades-logo-atemtia-2x.png" 
           alt="Servicios ATEMTIA" 
           class="logo-atemtia-login">
    </div>
    <form class="login-form">
      <div class="input-group">
        <input type="text" id="username" placeholder="USUARIO">
      </div>
      <div class="input-group">
        <input type="password" id="password" placeholder="CONTRASEÑA">
      </div>
      <button type="submit" class="btn-submit">INICIAR SESIÓN →</button>
    </form>
  </div>
</template>

<style lang="scss">
@import '../assets/styles/variables.scss';

.login-container {
  background-color: $color-fondo;
  width: 90%;
  max-width: 350px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: auto;
}

.logo-atemtia-login{
  width: 100%;
  margin-bottom: 20px; 
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.input-group {
  width: 100%;
}

input {
  width: 100%;
  font-size: 16px;
  color: black;
  padding: 8px;
  border-bottom: 1px solid $color-principal;
}

.btn-submit {
  background-color: $color-boton;
  color: $color-fondo;
  padding: 10px;
  border-radius: 7px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease, color 0.2s ease, 
  transform 0.2s ease;

  &:hover {
    background-color: $color-principal;
    transform: scale(1.01);
  }
}
</style>