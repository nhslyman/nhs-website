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
            <div class="shift">
              <input
                v-model="selectedShifts"
                type="checkbox"
                :value="shift.id"
                :disabled="
                  signedUp
                    || eventStatus === 'closed'
                    || (shift.max != 0 && (shift.signedUp.length >= shift.max))
                "
              >
              <strong>{{ shift.time.humanReadable }}</strong>
              <div class="attendance">
                <p>Signed Up: {{ shift.signedUp.length }}</p>
                <p>Target: {{ shift.target }}</p>
                <p
                  v-if="shift.max != 0"
                  :class="{ 'bold':(shift.signedUp.length >= shift.max) }"
                >
                  Maximum: {{ shift.max }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template v-if="eventStatus === 'closed'">
        <div class="too-late-text">
          <p>
            Signups for this event are now locked in.
          </p>
          <p v-if="signedUp">
            In the case of an emergency, please contact the volunteer
            coordinator if you will not be able to attend.
          </p>
        </div>
      </template>
      <template v-else-if="eventStatus === 'open'">
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
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { EventInfo, Shift, RSVP, UserAttributes, PlainDate } from "@/models";
import marked from "marked";

import EventPreview from "@/components/volunteer/EventPreview.vue";

@Component({
  components: { EventPreview }
})
export default class ViewEvent extends Vue {
  // shared
  selectedShifts: string[] = [];

  get events(): EventInfo[] {
    return this.$store.getters["events/sortedEvents"];
  }

  get event() {
    let event = this.events.find(
      event => event.id === this.$route.params["id"]
    );
    return event;
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

  get details() {
    if (this.event == null) {
      return "";
    }
    marked.setOptions({
      renderer: this.renderer // opens link in new tab
    });
    return marked(this.event.details);
  }

  // able to sign up
  signUp() {
    if (this.event == null) {
      return;
    }
    // triggers both user and event action
    this.$store
      .dispatch("signUpForEvent", {
        eventID: this.event.id,
        shiftIDs: this.selectedShifts
      })
      .then(() => {
        this.$router.push("/events");
      })
      .catch(() => {
        // TODO: server log
      });
  }

  // alredy signed up
  mounted() {
    if (this.rsvp == undefined) {
      return;
    }

    if (this.signedUp) {
      this.selectedShifts = this.rsvp.shiftIDs;
    }
  }

  @Watch("signedUp")
  signedUpChanged(signedUp: boolean) {
    if (this.rsvp == undefined) {
      return;
    }

    if (signedUp) {
      this.selectedShifts = this.rsvp.shiftIDs;
    }
  }

  get attributes(): UserAttributes | null {
    return this.$store.state.user.attributes;
  }

  get signedUpEvents(): RSVP[] {
    if (this.attributes == null) {
      return [];
    } else {
      return this.attributes.events;
    }
  }

  get rsvp(): RSVP | undefined {
    if (this.event == undefined) {
      return undefined;
    }
    return this.signedUpEvents.find(rsvp => {
      return rsvp.eventID == this.event!.id;
    });
  }

  get signedUp(): boolean {
    return this.rsvp != undefined;
  }

  get eventStatus(): String {
    // TODO: log errors
    if (this.event == undefined) {
      return "error";
    }
    if (this.event.shifts.length == 0) {
      return "error";
    }

    const firstShift = this.event.shifts[0].time.day;
    const currentDate = PlainDate.now();

    const diff = PlainDate.diff(firstShift, currentDate);
    if (diff > 1) {
      // first shift is more than one whole day away
      return "open";
    } if (diff < 0) {
      // event is in the past
      return "past";
    } else {
      // event is closed off
      return "closed";
    }
  }

  unregister() {
    if (this.event == null) {
      return;
    }
    if (confirm("Are you sure you want to unregister?")) {
      // triggers both user and event action
      this.$store
        .dispatch("unregisterForEvent", {
          eventID: this.event.id,
          shiftIDs: this.selectedShifts
        })
        .then(() => {
          this.$router.push("/events");
        })
        .catch(() => {
          // TODO: server log
        });
    }
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
