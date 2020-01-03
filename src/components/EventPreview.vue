<template>
  <div class="box">
    <div class="inside">
      <h2>{{ event.name }}</h2>

      <div class="insideContent">
        <div class="text">
          <div class="blurb">
            <p>{{ event.blurb }}</p>
          </div>
          <div v-if="event.wholeShift">
            <em>Note: Whole Shift Required</em>
          </div>
        </div>

        <div class="shifts">
          <div v-for="shift in event.shifts" :key="shift.id">
            <div class="shift">
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

      <div class="action-button">
        <router-link :to="eventPageLink">
          <p>more</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { EventInfo } from "@/models";

@Component
export default class EventPreview extends Vue {
  @Prop() private event!: EventInfo;

  get eventPageLink() {
    return "/events/view/" + this.event.id;
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

.box {
  @include shadow-box;
  @include event-format;
  width: 100%;
  margin-bottom: 3em;
}
</style>
