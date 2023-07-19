<template>
  <div>
    <div class="card dashboard">
      <MegaMenu :model="items" orientation="horizontal" class="dashboard-header-megamenu">
        <template #start class="dashboard-header">
          <span class="flex align-items-center">
            <a href="/">
            <img alt="logo" src="../image/logo.png" class="mr-2 dashboard-header-logo" />
          </a>
          </span>
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
          icon: "pi pi-align-justify",
          items: [
            [
              {
                label: this.$store.state.user.phoneNumber,
                items: [
                  {
                    label: "New Survey",
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
