<template>
  <div
    v-if="event"
    id="edit-event"
  >
    <div class="inside">
      <h1>Edit Event</h1>
      
      <EventEditor
        v-model="event"
      />

      <div id="buttons">
        <div class="action-button save">
          <button
            type="submit"
            class="submit"
            @click="saveChanges"
          >
            <p>Save Changes</p>
          </button>
        </div>
        <div class="action-button delete">
          <button @click="deleteEvent">
            <p>Delete Event</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { deepCopy } from "@/util";
import { plainToClass } from "class-transformer";

import { EventInfo } from "@/models";

import EventEditor from "@/components/admin/EventEditor.vue"

interface EventDict {
  [key: string]: EventInfo;
}

@Component({
  components: {
    EventEditor
  },
  computed: {
    ...mapGetters("events", {
      events: "eventsDict"
    })
  }
})
export default class NewEvent extends Vue {
  private editedEvent: EventInfo | null = null

  get selectedID() {
    return this.$route.params["id"]
  }

  events!: EventDict;

  get event(): EventInfo {
    // make sure its not still refrencing the vuex data
    const event = plainToClass(
      EventInfo,
      deepCopy<EventInfo>(this.events[this.selectedID])
    );
    return event;
  }

  set event(value: EventInfo) {
    this.editedEvent = value;
  }

  // buttons
  saveChanges() {
    if (this.editedEvent == null) {
      return;
    }
    this.sortShifts();
    this.$store.dispatch("events/setEvent", {
      eventID: this.editedEvent.id,
      event: this.editedEvent,
    }).then(() => {
      this.$toaster.success("Event saved!", 3500);
    });
  }

  sortShifts() {
    if (this.editedEvent == null) {
      return;
    }
    this.editedEvent.shifts = this.editedEvent.shifts.sort((a, b) => {
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

  deleteEvent() {
    if (
      confirm(
        `Are you sure you want to delete ${this.event?.name || "this event"}?`
      )
    ) {
      // TODO: Cloud Function
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#edit-event {
  @include shadow-box;
  @include std-size;
  @include std-position;

  #buttons {
    margin: 2.25em;

    .action-button {
      @include button;
      margin-top: 1.25em;
      margin-left: auto;
      margin-right: auto;

      p {
        padding: 0.25em 0.5em;
        color: white;
      }

      &.delete {
        @include scary-button-color;
      }
    }
  }
}
</style>
