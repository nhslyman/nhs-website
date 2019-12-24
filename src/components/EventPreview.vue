<template>
  <div class="box">
    <div class="inside">
      <h3>{{ event.name }}</h3>

      <div class="insideContent">
        <div class="left">
          <div class="blurb">
            <p>{{ event.blurb }}</p>
          </div>
          <div class="more button">
            <strong>more</strong>
          </div>
        </div>

        <div class="right">
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
            <div v-if="event.wholeShift">
              <em>Note: Whole Shift Required</em>
            </div>
          </div>
        </div>
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

.box {
  @include event-box;
  width: 100%;
  margin-bottom: 3em;

  .inside {
    padding: 1em 1em 2.5em 1em;
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
    flex-wrap: row;
    flex-direction: row;

    div {
      display: flex;
      flex-wrap: row;
      flex-direction: column;
      flex-basis: calc(50% - 1em);

      div {
        flex-basis: auto;
      }
    }

    .left {
      margin-right: 1em;
    }

    .right {
      margin-left: 1em;
    }

    .more {
      margin-top: 2em;
    }

    .shift {
      margin-bottom: 0.75em;
    }

    .attendance {
      font-size: 14px;
    }

    .button {
      @include rounded;
      background-color: $linkColor;
      text-align: center;
      width: 50%;

      strong {
        color: white;
        text-decoration: none;
      }

      &:hover {
        background-color: $hoverLinkColor;
      }
    }
  }
}
</style>
