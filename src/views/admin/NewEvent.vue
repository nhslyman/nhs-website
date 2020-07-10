<template>
  <div
    v-if="event"
    id="new-event"
  >
    <div class="inside">
      <h1>New Event</h1>
      
      <EventEditor
        v-model="event"
      />

      <div class="action-button save">
        <button
          type="submit"
          class="submit"
          @click="create"
        >
          <p>Create Event</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { EventInfo } from "@/models";

import EventEditor from "@/components/admin/EventEditor.vue"

@Component({
  components: {
    EventEditor
  },
})
export default class EditEvent extends Vue {
  event: EventInfo = EventInfo.empty;

  create() {
    this.sortShifts();
    this.$store.dispatch("events/setEvent", {
      eventID: this.event.id,
      event: this.event,
    }).then(_ => {
      this.$router.push("/admin/events");
    })
  }

  sortShifts() {
    if (this.event == null) {
      return;
    }
    this.event.shifts = this.event.shifts.sort((a, b) => {
      if (a.time.day.comparable > b.time.day.comparable) {
        return 1;
      } else if (a.time.day.comparable < b.time.day.comparable) {
        return -1;
      } else {
        if (a.time.startTime.minutesIntoDay > b.time.startTime.minutesIntoDay) {
          return 1;
        } else {
          return -1;
        }
      }
    });
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#new-event {
  @include shadow-box;
  @include std-size;
  @include std-position;

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
