<template>
  <div class="login-page">

    <div class="login-page-form">
      <template v-if="!confirmCodePlace">
        <span>Telefon numaranız:</span>
        <input v-model="phoneNumber" type="text" placeholder="+905xxxxxxxxx" />
        <button @click="loginUser">Gönder</button>
      </template>

      <template v-else>
        <span>Onay Kodu:</span>
        <input v-model="confirmCode" type="text" />
        <button @click="signConfirmation">Gönder</button>
      </template>
    </div>


    <div id="recaptcha-container"></div>
  </div>
</template>

<script>
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateEmail,
  updateProfile,
  signOut,
} from "./../../firebase-config";
export default {
  name: "login",
  data() {
    return {
      phoneNumber: null,
      confirmCodePlace: false,
      confirmCode: null,
    };
  },
  mounted() {
    this.createVerify();

  },
  methods: {
    createVerify() {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => { },
        },
        auth
      );
    },
    loginUser() {
      const appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth, this.phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          this.confirmCodePlace = true;
        })
        .catch((error) => {
          alert(error);
        });
    },
    signConfirmation() {
      confirmationResult
        .confirm(this.confirmCode)
        .then((result) => {
          const user = result.user;
          console.log("user", user);

          this.$store.dispatch('setAuth', user)
          this.$socket.emit("userlogin", {uid: user.uid, phoneNumber: user.phoneNumber});
          this.$router.push("/");
        })
        .catch((error) => {
          alert(error);
          //this.confirmCodePlace = false;
        });
    },
  },
};
</script>
<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-page-form{
  display: flex;
  flex-direction: column;
}
</style>