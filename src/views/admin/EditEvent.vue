<template>
  <div v-if="event" id="edit-event">
    <div class="inside">
      <h1>Edit Event</h1>
      <div class="form">
        <div class="group">
          <label for="name">
            <h2>Event Name</h2>
          </label>

          <div>
            <input
              v-model="event.name"
              type="text"
              class="form-control name-editor"
              name="name"
              placeholder="Name"
            />
          </div>
        </div>

        <div class="group">
          <label for="blurb">
            <h2>Blurb</h2>
          </label>

          <div>
            <ResizeAuto>
              <template v-slot:default="{ resize }">
                <textarea
                  ref="blurb"
                  v-model="event.blurb"
                  class="form-control"
                  name="blurb"
                  @input="resize"
                />
              </template>
            </ResizeAuto>
          </div>
        </div>

        <div class="group">
          <label for="details">
            <h2>Details</h2>
          </label>

          <div>
            <MDEditor v-model="event.details" />
            <p>Please don't use headings (#) here</p>
          </div>
        </div>

        <div class="group">
          <label for="shifts">
            <h2>Shifts</h2>
          </label>

          <div>
            <ShiftsEditor v-model="event.shifts" />
          </div>

          <div>
            <input
              v-model="event.wholeShift"
              type="checkbox"
              name="wholeShift"
            />
            <label for="wholeShift"> Must Attend Entire Shift</label>
          </div>
        </div>

        <div class="action-button save">
          <button type="submit" class="submit" @click="saveChanges">
            <p>Save Changes</p>
          </button>
        </div>
      </div>

      <div class="action-button delete">
        <button @click="deleteEvent">
          <p>Delete Event</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { EventInfo } from "@/models";
import { deepCopy } from "@/util";
import { plainToClass } from "class-transformer";

import MDEditor from "@/components/MDEditor.vue";
import ShiftsEditor from "@/components/ShiftsEditor.vue";
import ResizeAuto from "@/components/ResizeAuto.vue";

@Component({
  components: {
    MDEditor,
    ShiftsEditor,
    ResizeAuto
  }
})
export default class EditEvent extends Vue {
  event: EventInfo | null = null;

  get events(): EventInfo[] {
    return this.$store.getters["events/sortedEvents"];
  }

  get index(): number {
    return this.events.findIndex(
      event => event.id === this.$route.params["id"]
    );
  }

  // buttons
  saveChanges() {
    if (this.event == null) {
      return;
    }
    this.sortShifts();
    this.$store.dispatch("events/setEvent", {
      eventID: this.event.id,
      event: this.event
    });
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

  deleteEvent() {
    if (
      confirm(
        `Are you sure you want to delete ${this.event?.name || "this event"}?`
      )
    ) {
      // TODO: Cloud Function
    }
  }

  // load copy of event
  mounted() {
    this.event = plainToClass(
      EventInfo,
      deepCopy<EventInfo>(this.events[this.index])
    );
  }

  @Watch("events")
  indexChanged() {
    this.event = this.events[this.index];
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

  .name-editor {
    width: 100%;
  }

  textarea {
    @include rounded;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    font-size: 15px;
    background-color: $insetEditor;
    width: 100%;
    resize: none;
    box-sizing: border-box;
    padding: 10px 20px;
    border: 1px solid $boarderColor;
  }

  .group {
    margin-bottom: 1em;
  }

  .action-button {
    @include button;
    margin-top: 1.6em;
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
</style>
