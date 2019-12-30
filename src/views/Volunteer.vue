<template>
  <div id="volunteer">
    <h1>Volunteer Oppurtunities</h1>
    <h2>Signed Up</h2>
    <div v-for="event in regristeredEvents" :key="event.id">
      <EventPreview :event="event" />
    </div>
    <div v-if="regristeredEvents.length == 0">
      <p>No Events Avaliable</p>
    </div>
    <h2>Avaliable</h2>
    <div v-for="event in availableEvents" :key="event.id">
      <EventPreview :event="event" />
    </div>
    <div v-if="availableEvents.length == 0">
      <p>No Events Avaliable</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import EventPreview from "@/components/EventPreview.vue";
import { EventInfo } from "@/models";

@Component({
  components: { EventPreview }
})
export default class Volunteer extends Vue {
  get events(): EventInfo[] {
    return this.$store.state.events.events;
  }

  get regristeredEvents() {
    return this.events.slice(0, 2);
  }

  get availableEvents() {
    return this.events.slice(2, 5);
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

  @media (min-width: 1000px) {
    padding-left: 20%;
    padding-right: 20%;
  }

  @media (min-width: 1200px) {
    padding-left: 25%;
    padding-right: 25%;
  }

  @media (min-width: 1800px) {
    padding-left: 30%;
    padding-right: 30%;
  }

  @media (min-width: 2100px) {
    padding-left: 35%;
    padding-right: 35%;
  }

  h1 {
    font-size: 30px;
    line-height: 150%;
    color: $titleColor;
  }

  h2 {
    font-size: 25px;
    line-height: 150%;
    color: $headingColor;
    padding-bottom: 0.25em;
  }

  p {
    font-size: 20px;
    padding-top: 1em;
    padding-bottom: 2em;
  }

  a {
    color: $linkColor;
  }

  a:hover {
    color: $hoverLinkColor;
  }
}
</style>
