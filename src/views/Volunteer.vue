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
  @include box-size;

  margin-left: auto;
  margin-right: auto;
  margin-top: 2.5%;
  margin-bottom: 10%;
  color: black;

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
