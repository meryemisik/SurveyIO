<template>
    <div>
        <input v-model="phoneNumber" type="text"/>
        <button @click="submitForm">Gönder</button>
    </div>
</template>

<script>

export default {
  name: "login",
  data() {
    return {
        phoneNumber:null
    };
  },
  methods: {
    submitForm(){
        console.log('phone', this.phoneNumber)
    }
  },
};
</script>