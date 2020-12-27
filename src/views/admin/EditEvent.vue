<template>
  <div
    v-if="origEvent"
    id="edit-event"
  >
    <div class="inside">
      <h1>Edit Event</h1>

      <EventEditor v-model="editedEvent" />

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
import { deepCopy, Optional } from "@/util";
import { plainToClass } from "class-transformer";
import { db } from "@/main";

import { EventInfo, Shift, ShiftTime, RSVP } from "@/models";

import EventEditor from "@/components/admin/EventEditor.vue";

interface EventDict {
  [key: string]: EventInfo;
}

@Component({
  components: {
    EventEditor,
  },
  computed: {
    ...mapGetters("events", {
      events: "eventsDict",
    }),
  },
})
export default class NewEvent extends Vue {
  // event
  private origEvent: Optional<EventInfo> = null;
  private editedEvent: Optional<EventInfo> = null;

  get selectedID() {
    return this.$route.params["id"];
  }

  events!: EventDict;

  mounted() {
    const eventPlain = this.events[this.selectedID];
    if (!eventPlain) {
      this.$router.push("/admin/events");
      return null;
    }

    this.origEvent = plainToClass(EventInfo, deepCopy<EventInfo>(eventPlain));
    this.editedEvent = plainToClass(EventInfo, deepCopy<EventInfo>(eventPlain));
  }

  // buttons
  async saveChanges() {
    if (this.editedEvent == null) {
      return;
    }
    if (this.editedEvent.shifts.length == 0) {
      this.$toaster.error("You must first add a shift.");
      return;
    }
    this.sortShifts();
    try {
      await this.removeShiftsFromUsers();
      await this.$store.dispatch("events/setEvent", {
        eventID: this.selectedID,
        event: this.editedEvent,
      });
      this.$toaster.success("Event saved!", 3500);
    } catch (err) {
      this.$toaster.error("Event did not save", 3500);
    }
  }

  async removeShiftsFromUsers() {
    // Get which shifts have been deleted
    if (this.origEvent == null) {
      return;
    }
    let removed: Shift[] = [];
    this.origEvent?.shifts.forEach((oldShift) => {
      let eventIndex = this.editedEvent?.shifts.findIndex(
        (newShift) =>
          plainToClass(Shift, newShift).id === plainToClass(Shift, oldShift).id
      );
      if (eventIndex == -1) {
        removed.push(oldShift);
      }
    });

    // Remove each deleted shift from all users that have it
    for (const shift of removed) {
      for (const userID of shift.signedUp) {
        // Get events for user from firestore
        let userDoc = db.collection("users").doc(userID);
        let userRef = await userDoc.get();
        let data = userRef.data()!;
        if (data == undefined) {
          continue;
        }

        // Get index of event
        let userEvents = data.events as RSVP[];
        let origID = this.origEvent.id;
        let eventIndex = userEvents.findIndex(
          (userEvent) => userEvent.eventID == origID
        );

        // Filter out the deleted shift
        let userShifts = userEvents[eventIndex].shiftIDs;
        let shiftID = plainToClass(Shift, shift).id;
        let filteredShifts = userShifts.filter(
          (userShiftID) => userShiftID != shiftID
        );

        // Replace shifts with filtered
        if (filteredShifts.length == 0) {
          // delete event from user if not singed up for any shifts
          userEvents.splice(eventIndex, 1);
        } else {
          // replace shifts with filtered shifts
          userEvents[eventIndex].shiftIDs = filteredShifts;
        }

        // Save that filtered shift to firestore
        await userDoc.update({
          events: userEvents,
        });
      }
    }
  }

  sortShifts() {
    if (this.editedEvent == null) {
      return;
    }
    this.editedEvent.shifts = this.editedEvent.shifts.sort(
      (a, b) =>
        plainToClass(ShiftTime, a.time).comparable -
        plainToClass(ShiftTime, b.time).comparable
    );
  }

  async deleteEvent() {
    if (this.origEvent == null) {
      return;
    }
    if (
      confirm(
        `Are you sure you want to delete ${this.origEvent.name ||
          "this event"}?`
      )
    ) {
      // will auto route back to home on successful delete
      // because of the event getter null check
      try {
        await this.$store.dispatch("events/deleteEvent", this.origEvent.id)
        this.$toaster.success("Event deleted!");
        this.$router.push("/admin/events")
      } catch {
        this.$toaster.error("Could not delete event");
      }
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
