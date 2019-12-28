<template>
  <div class="box">
    <div class="inside">
      <h3>{{ event.name }}</h3>

      <div class="insideContent">
        <div class="text">
          <div class="blurb">
            <p>{{ event.blurb }}</p>
            <br />
            <p>{{ event.details }}</p>
          </div>
          <div v-if="event.wholeShift">
            <em>Note: Whole Shift Required</em>
          </div>
        </div>

        <div class="shifts">
          <h4>Select Shift(s)</h4>
          <div v-for="shift in event.shifts" :key="shift.id">
            <div class="shift">
              <input
                type="checkbox"
                :value="shift.id"
                v-model="selectedShifts"
              />
              <strong>{{ shift.time.humanReadable }}</strong>
              <div class="attendance">
                <p>Signed Up: {{ shift.signedUp.length }}</p>
                <p>Target: {{ shift.target }}</p>
                <p>Maximum: {{ shift.max == 0 ? "none" : shift.max }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="more">
        <p>Sign Up</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import EventPreview from "@/components/EventPreview.vue";
import { EventInfo, Shift } from "@/models";
import EventStore from "@/mock/events";

@Component({
  components: { EventPreview }
})
export default class Event extends Vue {
  selectedShifts: Shift[] = [];

  get event() {
    EventStore.import();
    let event = EventStore.events.find(
      event => event.id === this.$route.params["id"]
    );
    return event;
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

.box {
  @include shadow-box;
  @include event-format;
  width: 80%;
  margin: 1.75em auto 3em auto;

  h4 {
    width: 100%;
    margin-bottom: 0.5em;
  }

  strong {
    padding-left: 0.25em;
  }
}
</style>
