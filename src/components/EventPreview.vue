<template>
  <div class="box">
    <div class="inside">
      <h3>{{ event.name }}</h3>

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
                <p>Maximum: {{ shift.max }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="more button">
        <strong>more</strong>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import EventInfo from "@/models/EventInfo";

@Component
export default class EventPreview extends Vue {
  @Prop() private event!: EventInfo;
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

$maxMobileSize: 800px;

.box {
  @include event-box;
  width: 100%;
  margin-bottom: 3em;

  .inside {
    padding: 1em 1em 1.5em 1em;
  }

  h3 {
    color: $headingColor;
    font-size: 20px;
    width: 100%;
    padding-bottom: 1em;
  }

  p {
    line-height: 150%;
  }

  .insideContent {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;

    @media (min-width: $maxMobileSize) {
      flex-direction: row;
    }

    .shifts {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      margin-top: 1em;

      @media (min-width: $maxMobileSize) {
        margin-top: 0;
        margin-left: 1em;
      }

      @media (min-width: $maxMobileSize) {
        flex-direction: column;
      }

      div {
        flex-basis: auto;
      }
    }

    .text {
      width: 100%;
      @media (min-width: $maxMobileSize) {
        margin-right: 1em;
        width: calc(50% - 1em);
      }
    }

    .shift {
      margin-bottom: 0.75em;
      width: 75%;
      padding-left: 10%;
      padding-right: 10%;
      margin-left: auto;
      margin-right: auto;
    }

    .attendance {
      font-size: 14px;
    }
  }

  .more {
    margin-left: auto;
    margin-right: auto;
    margin-top: 0.5em;
  }

  .button {
    @include rounded;
    background-color: $linkColor;
    text-align: center;
    width: 8em;

    strong {
      color: white;
      text-decoration: none;
    }

    &:hover {
      background-color: $hoverLinkColor;
    }
  }
}
</style>
