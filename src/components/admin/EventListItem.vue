<template>
  <div class="event">
    <div class="event-text">
      <p>
        <strong>{{ event.name }}</strong>
      </p>
      <span class="spacer" />
      <p>{{ event.shifts[0].time.day.humanReadable }}</p>
    </div>

    <span class="spacer" />

    <div class="buttons">
      <div class="button">
        <router-link :to="'/admin/events/view/' + event.id">
          <p>users</p>
        </router-link>
      </div>
      <span class="spacer" />
      <div class="button">
        <router-link :to="'/admin/events/edit/' + event.id">
          <p>edit</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { EventInfo } from "@/models";

@Component
export default class EventListItem extends Vue {
  @Prop() event!: EventInfo;
}
</script>

<style lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

.event {
  padding: 0 1em;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  align-items: center;

  @media (min-width: 500px) {
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
  }

  .edit {
    margin: 10px;
  }

  .event-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 90%;

    @media (min-width: 500px) {
      flex-wrap: wrap;
      flex-direction: row;
      width: auto;
    }
  }

  .spacer {
    height: 10px;
    width: 10px;
  }

  .buttons {
    display: flex;
    flex-direction: row;

    @media (min-width: 500px) {
      flex-direction: column;
    }

    .button {
      @include button;
      width: 5em;

      a {
        color: white;
        text-decoration: none;
      }
    }
  }
}
</style>
