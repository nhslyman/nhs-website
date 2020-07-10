<template>
  <div id="edit-home">
    <div class="inside">
      <h1>Edit Home Text</h1>
      <MDEditor v-model="homeText" />
      <p>Start with secondary headings (##) here</p>

      <div class="action-button save">
        <button
          type="submit"
          class="submit"
          @click="saveChanges"
        >
          <p>Save Changes</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import MDEditor from "@/components/inputs/MDEditor.vue";

@Component({
  components: { MDEditor },
})
export default class EditHome extends Vue {
  homeText: String | null = null;

  saveChanges() {
    if (this.homeText == null) {
      return;
    }
    this.$store.dispatch("text/setHome", this.homeText);
  }

  mounted() {
    this.homeText = this.$store.getters["text/homeText"];
  }
}
</script>

<style lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#edit-home {
  @include wide-size;
  @include shadow-box;
  @include std-position;
  color: black;

  .action-button {
    @include button;
    margin-top: 1.6em;
    margin-left: auto;
    margin-right: auto;

    p {
      padding: 0.25em 0.5em;
      color: white;
    }
  }
}
</style>
