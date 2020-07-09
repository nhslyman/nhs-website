<template>
  <ErrorPage
    code="404"
    description="Page Not Found"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ErrorPage from "@/components/Error.vue";

@Component({
  components: { ErrorPage }
})
export default class EventPreview extends Vue {}
</script>
