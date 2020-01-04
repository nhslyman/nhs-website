<template>
  <div v-if="events != null" id="volunteer">
    <h1>Volunteer Oppurtunities</h1>
    <h2>Signed Up</h2>
    <div v-for="event in regristeredEvents" :key="event.id">
      <EventPreview :event="event" />
    </div>
    <div v-if="regristeredEvents.length == 0">
      <p>You haven't selected any events... Yet.</p>
    </div>
    <h2>Avaliable</h2>
    <div v-for="event in availableEvents" :key="event.id">
      <EventPreview :event="event" />
    </div>
    <div v-if="availableEvents.length == 0">
      <p>No more events avaliable</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import EventPreview from "@/components/EventPreview.vue";
import { EventInfo, RSVP, UserAttributes } from "@/models";

@Component({
  components: { EventPreview }
})
export default class Events extends Vue {
  get events(): EventInfo[] {
    return this.$store.state.events.events;
  }

  get attributes(): UserAttributes {
    return this.$store.state.user.attributes;
  }

  get signedUpEvents(): RSVP[] {
    if (this.attributes == null) {
      return [];
    }
    return this.attributes.events;
  }

  get regristeredEvents() {
    return this.events.filter(event =>
      this.signedUpEvents.some(
        signedUpEvent => signedUpEvent.eventID == event.id
      )
    );
  }

  get availableEvents() {
    return this.events.filter(
      event =>
        !this.signedUpEvents.some(
          signedUpEvent => signedUpEvent.eventID == event.id
        )
    );
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#volunteer {
  @include std-size;
  @include std-position;
  color: black;

  h2 {
    padding-bottom: 0.25em;
  }

  p {
    font-size: 20px;
    padding-top: 1em;
    padding-bottom: 2em;
  }
}
</style>
