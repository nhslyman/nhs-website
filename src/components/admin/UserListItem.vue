<template>
  <p>{{ name }}</p>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { deepCopy } from "@/util";
import { plainToClass } from "class-transformer";
import { db } from "@/main";

import { EventInfo, UserAttributes } from "@/models";

@Component
export default class NewEvent extends Vue {
  @Prop() userId!: string
  name = ""

  mounted() {
    // get the name from firestore
    db.collection("users").doc(this.userId).get().then( (user) => {
      let data = user.data();
      if (data != undefined) {
        this.name = `${data.firstName} ${data.lastName}`;
      }
    });
  }
}
</script>

<style scoped lang="scss">
</style>
