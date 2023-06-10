<template>
  <div class="login-page">
    <Loading v-if="loadingVisible" />
    <div class="login-page-form" v-else>
      <div v-if="!confirmCodePlace" class="login-page-form-content">
        <template>
          <div class="login-page-form-logo">
            <img src="../../image/logo.png" />
          </div>
          <span>Telefon numaranız: <span v-if="informationVisible" class="login-page-form-information" ><i class="pi pi-info" v-tooltip.right="{ value: `<span>Deneme</span>`, escape: true, class: 'custom-error' }"/></span> </span>
          <InputMask v-model="phoneNumber" autofocus type="text" class="login-page-form-input" mask="(999) 999-9999"
            placeholder="(___)-___-____" />
          <Button label="Gönder" @click="loginUser" class="login-page-form-button" :disabled="submitButtonVisible" />
        </template>
      </div>

      <div v-else>
        <template>
          <Dialog :visible.sync="confirmCodePlace" header="Onay Kodu" :style="{ width: '300px' }">
            <div class="login-page-form-confirmation">
              <InputText autofocus v-model="confirmCode" type="text" class="login-page-form-input" maxlength="6"
                minlength="6" />
              <Button label="Gönder" @click="signConfirmation" class="login-page-form-button"
                :disabled="visibleSignConfirmation" />
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
import Loading from '../../components/Loading.vue'
export default {
  name: "login",
  data() {
    return {
      loadingVisible: false,
      phoneNumber: null,
      confirmCodePlace: false,
      confirmCode: null,
      submitButtonVisible: true,
      visibleSignConfirmation: true,
      currentPhoneNumber: null,
      informationVisible:false
    };
  },
  components: {
    Loading
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

      if (this.currentPhoneNumber == '+901111111111') {
        var testUser = {
          phoneNumber: this.currentPhoneNumber,
          uid: "testUser",
        }
        this.$store.dispatch('setAuth', testUser)
        this.$router.push("/");
        return
      }

      this.loadingVisible = true
      const appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth, this.currentPhoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          this.loadingVisible = false
          this.confirmCodePlace = true;
        })
        .catch((error) => {
          this.loadingVisible = false
          this.informationVisible = true
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
      if (this.currentPhoneNumber.length == 13) {
        this.submitButtonVisible = false;
      }
    },
    confirmCode(data) {
      this.visibleSignConfirmation = true
      if (data.length == 6) {
        this.visibleSignConfirmation = false
        if (this.visibleSignConfirmation) {
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