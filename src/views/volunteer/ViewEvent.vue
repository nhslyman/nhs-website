<template>
  <div
    v-if="event"
    id="view-event"
  >
    <div class="inside">
      <h2>{{ event.name }}</h2>

      <div class="insideContent">
        <div class="text">
          <div class="blurb">
            <p>{{ event.blurb }}</p>
            <br>
            <div v-html="details" />
          </div>
          <div v-if="event.wholeShift">
            <em>Note: Whole Shift Required</em>
          </div>
        </div>

        <div class="shifts">
          <h3>Select Shift(s)</h3>
          <div
            v-for="shift in event.shifts"
            :key="shift.id"
          >
            <ShiftOption
              :shift="shift"
              :signed-up="signedUp"
              :selected="selectedShifts"
              @input="edited"
            />
          </div>
        </div>
      </div>

      <template v-if="eventStatus === ShiftState.Locked">
        <div class="too-late-text">
          <p>
            Signups for all shifts are now locked in.
          </p>
          <p v-if="signedUp">
            In the case of an emergency, please contact a volunteer coordinator
            if you will not be able to attend.
          </p>
        </div>
      </template>
      <template v-else-if="eventStatus === ShiftState.Open">
        <template v-if="signedUp">
          <div class="action-button unregister">
            <button @click="unregister">
              <p>Unregister</p>
            </button>
          </div>
        </template>
        <template v-else>
          <div
            class="action-button"
            :class="{ disabled: selectedShifts.length == 0 }"
          >
            <button
              :disabled="selectedShifts.length == 0"
              @click="signUp"
            >
              <p>Sign Up</p>
            </button>
          </div>
        </template>
      </template>
      <template v-else-if="eventStatus === ShiftState.Past">
        <p class="too-late-text">
          This event has passed.
        </p>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { EventInfo, Shift, RSVP, UserAttributes, ShiftState} from "@/models";
import marked from "marked";
import { Optional, Dict } from "@/util";

import ShiftOption from "@/components/volunteer/ShiftOption.vue";

@Component({
  components: { ShiftOption },
})
export default class ViewEvent extends Vue {
  // shift selector
  selectedShifts: string[] = [];

  edited(selected: string[]) {
    this.selectedShifts = selected;
  }

  // events
  get event(): Optional<EventInfo> {
    return this.events[this.id];
  }

  get id(): string {
    return this.$route.params["id"];
  }

  get events(): Dict<EventInfo> {
    return this.$store.getters["events/eventsDict"];
  }


  // rendered details
  get details() {
    if (this.event == null) {
      return "";
    }
    marked.setOptions({
      renderer: this.renderer, // opens link in new tab
    });
    return marked(this.event.details);
  }

  get renderer(): marked.Renderer {
    let renderer = new marked.Renderer();
    const linkRenderer = renderer.link;
    renderer.link = (href, title, text) => {
      const html = linkRenderer.call(renderer, href, title, text);
      return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
    };
    return renderer;
  }

  // sign up and undo
  signUp() {
    if (this.event == null) {
      return;
    }
    // triggers both user and event action
    this.$store
      .dispatch("signUpForEvent", {
        eventID: this.event.id,
        shiftIDs: this.selectedShifts,
      })
      .then(() => {
        this.$router.push("/events");
      })
      .catch(() => {
        // TODO: server log
      });
  }

  unregister() {
    if (!this.event) {
      return;
    }
    if (confirm("Are you sure you want to unregister?")) {
      // triggers both user and event action
      this.$store
        .dispatch("unregisterForEvent", {
          eventID: this.event.id,
          shiftIDs: this.selectedShifts,
        })
        .then(() => {
          this.$router.push("/events");
        })
        .catch(() => {
          // TODO: server log
        });
    }
  }

  // date based event status
  ShiftState = ShiftState; // exposes enum to vue template

  get eventStatus(): ShiftState {
    // TODO: log errors
    if (this.event == undefined) {
      throw new Error("No event");
    }
    if (this.event.shifts.length == 0) {
      throw new Error("No shifts in event");
    }

    const lastShift = this.event.shifts[this.event.shifts.length - 1];
    return lastShift.state;
  }

  // load stuff if already signed up
  mounted() {
    this.selectedShifts = this.rsvp?.shiftIDs ?? [];
  }

  @Watch("signedUp")
  signedUpChanged() {
    this.selectedShifts = this.rsvp?.shiftIDs ?? [];
  }

  get signedUp(): boolean {
    return this.rsvp != null;
  }

  get rsvp(): Optional<RSVP> {
    if (!this.event) {
      return null;
    }
    return this.signedUpEvents.find((rsvp) => {
      return rsvp.eventID == this.event!.id;
    });
  }

  get signedUpEvents(): RSVP[] {
    if (this.attributes == null) {
      return [];
    } else {
      return this.attributes.events;
    }
  }

  get attributes(): Optional<UserAttributes> {
    return this.$store.state.user.attributes;
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#view-event {
  @include shadow-box;
  @include event-format;
  @include std-size;
  @include std-position;

  h3 {
    width: 100%;
    margin-bottom: 0.5em;
  }

  strong {
    padding-left: 0.25em;
  }

  .unregister {
    @include scary-button-color;
  }

  .disabled {
    background-color: gray;

    &:hover {
      background-color: gray;
    }
  }

  .too-late-text {
    margin-top: 1.75em;
    width: 80%;
    text-align: center;
    margin-left: auto;
    margin-right: auto;

    p {
      padding-bottom: 0.5em;
    }

    @media (min-width: $maxMobileSize) {
      width: 60%;
    }
  }

  .bold {
    font-weight: bold;
  }
}
</style>
