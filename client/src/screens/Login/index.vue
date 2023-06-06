<template>
  <div class="login-page">

    <div class="login-page-form">
      <div v-if="!confirmCodePlace" class="login-page-form-content">
        <template>
          <div class="login-page-form-logo">
            <img src="../../image/logo.png" />
          </div>
          <span>Telefon numaranız:</span>
          <InputMask  v-model="phoneNumber" autofocus
            type="text"
            class="login-page-form-input"
            mask="(999) 999-9999" placeholder="(___)-___-____"
            />
          <Button
            label="Gönder"
            @click="loginUser"
            class="login-page-form-button"
            :disabled="submitButtonVisible"
          />
        </template>
      </div>

      <div v-else>
        <template>
          <Dialog
            :visible.sync="confirmCodePlace"
            header="Onay Kodu"
            :style="{ width: '300px' }"
          >
            <div class="login-page-form-confirmation">
              <InputText
               autofocus
                v-model="confirmCode"
                type="text"
                class="login-page-form-input"
                maxlength="6"
                minlength="6"
              />
              <Button
                label="Gönder"
                @click="signConfirmation"
                class="login-page-form-button"
                :disabled="visibleSignConfirmation"
              />
            </div>
          </Dialog>
        </template>
      </div>
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
      submitButtonVisible: true,
      visibleSignConfirmation:true,
      currentPhoneNumber:null
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
      signInWithPhoneNumber(auth, this.currentPhoneNumber, appVerifier)
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
          this.$socket.emit("userlogin", {
            uid: user.uid,
            phoneNumber: user.phoneNumber,
          });
          this.$router.push("/");
        })
        .catch((error) => {
          alert(error);
          //this.confirmCodePlace = false;
        });
    },
  },
  watch: {
    phoneNumber(data) {
      this.currentPhoneNumber = `${data}`.replace(/[^\d]/g, "")
      this.currentPhoneNumber = `+90${this.currentPhoneNumber}`
      this.submitButtonVisible = true;
      if (this.currentPhoneNumber.length ==  13) {
        this.submitButtonVisible = false;
      } 
    },
    confirmCode(data) {
      this.visibleSignConfirmation = true
      if(data.length == 6){
        this.visibleSignConfirmation = false
        if(this.visibleSignConfirmation){
          this.signConfirmation()
        }
      }
    },
  },
};
</script>
<style lang="scss">
@import "../../assets/scss/login.scss";
</style>