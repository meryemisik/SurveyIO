<template>
  <div class="dashboard">
    <MegaMenu orientation="horizontal" class="dashboard-header-megamenu">
      <template #start class="dashboard-header">
        <img
          alt="logo"
          src="../image/logo.png"
          class="mr-2 dashboard-header-logo"
        />
      </template>
      <template #end>
        <div class="dashboard-toggle" @click="toggle">
          <i class="pi pi-align-justify" />
        </div>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      </template>
    </MegaMenu>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {


    return {
      items: [
        {
          label: this.$store.state.user.phoneNumber,
          items: [
            {
              label: "New Chart",
              icon: "pi pi-plus",
              command: () => {
                this.createSurvey();
              },
            },
            {
              label: "My Account",
              icon: "pi pi-user",
              to: "/profile",
            },
            {
              label: "Logout",
              icon: "pi pi-sign-out",
              command: () => {
                this.$store.dispatch("logout");
              },
            },
          ],
        },
      ],
    };
  },

  methods: {
    createSurvey(){
      this.$emit('newChart');
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
  },
};
</script>

<style lang="scss">
@import "../assets/scss/chartBar.scss";
@import "../assets/scss/sidebar.scss";
</style>
