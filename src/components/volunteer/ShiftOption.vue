<template>
  <div class="shift-option">
    <!-- Content -->
    <h4>{{ shift.time.humanReadable }}</h4>
    <div class="attendance">
      <p>Signed Up: {{ shift.signedUp.length }}</p>
      <p>Target: {{ shift.target }}</p>
      <p
        v-if="shift.max != 0"
        :class="{ 'bold': eventStatus === ShiftState.Full }"
      >
        Maximum: {{ shift.max }}
      </p>
    </div>

    <!-- Button -->
    <template v-if="eventStatus === ShiftState.Locked">
      <p class="too-late-text">
        Signups are now locked in.
      </p>
    </template>
    <template v-else-if="eventStatus === ShiftState.Past">
      <p class="too-late-text">
        This shift has passed
      </p>
    </template>
    <!-- open or full -->
    <template v-else>
      <template v-if="signedUp">
        <div class="action-button unregister">
          <button
            class="unregister"
            @click="unregister"
          >
            <p>Unregister</p>
          </button>
        </div>
      </template>
      <template v-else>
        <template v-if="eventStatus === ShiftState.Full">
          <p class="too-late-text">
            This shift is full
          </p>
        </template>
        <template v-else>
          <button @click="signUp">
            <p>Sign Up</p>
          </button>
        </template>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import { Shift, PlainDate, ShiftState, EventInfo, RSVP, UserAttributes } from "@/models";
import { Optional } from '@/util';

@Component
export default class ViewEvent extends Vue {
  // set by parent
  @Prop() shift!: Shift
  @Prop() event!: EventInfo;

  // sign up and unregister
  signUp() {
    // triggers both user and event action
    this.$store
      .dispatch("signUpForShift", {
        eventID: this.event.id,
        shiftID: this.shift.id,
      })
      .then(() => {
        this.$toaster.success("Signed up!");
      })
      .catch((err) => {
        // TODO: server log
      });
  }

  unregister() {
    if (confirm("Are you sure you want to unregister?")) {
      // triggers both user and event action
      this.$store
        .dispatch("unregisterForShift", {
          eventID: this.event.id,
          shiftID: this.shift.id,
        })
        .then(() => {
          this.$toaster.success("Unregistered");
        })
        .catch(() => {
          // TODO: server log
        });
    }
  }

  // date based event status
  ShiftState = ShiftState; // exposes enum to vue template

  get eventStatus(): ShiftState {
    return this.shift.state;
  }

  // find if signed up
  get signedUp(): boolean {
    if (!this.rsvp) {
      return false;
    }
    return this.rsvp.shiftIDs.includes(this.shift.id);
  }

  get rsvp(): Optional<RSVP> {
    return this.signedUpEvents.find(rsvp => 
      rsvp.eventID == this.event!.id
    );
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

.shift-option {
  margin-bottom: 1em; 

  h3 {
    width: 100%;
    margin-bottom: 0.5em;
  }

  button {
    @include button;

    &.unregister {
      @include scary-button-color;
    }
  }

  .too-late-text {
    @include button;

    background-color: #797979;
    padding: 5px;
    line-height: 120%;

    &:hover {
      background-color: #797979;
    }

  }

  .bold {
    font-weight: bold;
  }
}
</style>
