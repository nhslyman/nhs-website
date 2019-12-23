<template>
  <div id="volunteer">
    <h1>Volunteer Oppurtunities</h1>
    <h2>Signed Up</h2>
    <div v-for="event in regristeredEvents" :key="event.id">
      <EventPreview v-bind:event="event" />
    </div>
    <h2>Avaliable</h2>
    <div v-for="event in availableEvents" :key="event.id">
      <EventPreview v-bind:event="event" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import EventPreview from "@/components/EventPreview.vue";
import EventInfo from "@/models/EventInfo";
import DateTimeRange from "@/models/DateTimeRange";
import randomEvent from "@/mock/events";

@Component({
  components: { EventPreview }
})
export default class Volunteer extends Vue {
  get regristeredEvents() {
    return [randomEvent(), randomEvent()];
  }

  get availableEvents() {
    return [randomEvent(), randomEvent(), randomEvent()];
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#volunteer {
  margin-left: auto;
  margin-right: auto;
  padding: 2.5% 10% 10% 10%;
  color: black;

  h1 {
    font-size: 30px;
    line-height: 150%;
    color: $titleBlue;
  }

  h2 {
    font-size: 25px;
    line-height: 150%;
    color: $headingColor;
    padding-bottom: 0.25em;
  }

  a {
    color: $linkColor;
  }

  a:hover {
    color: $hoverLinkColor;
  }
}
</style>
