<template>
  <div>
    <div class="dashboard">
      <MegaMenu orientation="horizontal" class="dashboard-header-megamenu">
        <template #start class="dashboard-header">
          <a href="/">
            <img alt="logo" src="../image/logo.png" class="mr-2 dashboard-header-logo" />
          </a>
        </template>
        <template #end>
          <div class="dashboard-toggle" @click="toggle">
            <i class="pi pi-align-justify" />
          </div>
          <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
        </template>
      </MegaMenu>
    </div>
    <CreateChartSidebar ref="sidebar" />
  </div>
</template>

<script>
import CreateChartSidebar from './CreateChartSidebar.vue';
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
                this.openSidebar();
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
  components: {
    CreateChartSidebar
  },
  methods: {
    openSidebar() {
      this.$refs.sidebar.openSidebar()
    },
    toggle(event) {
      this.$refs.menu.toggle(event);
    },
  },
};
</script>

<style lang="scss">
@import "../assets/scss/chartBar.scss";
</style>
