<template>
  <ErrorPage code="403" description="Access Denied: Unauthorized" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ErrorPage from "@/components/Error.vue";

@Component({
  components: { ErrorPage }
})
export default class EventPreview extends Vue {}
</script>
