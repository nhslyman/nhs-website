<template>
  <div id="admin-console">
    <div class="inside">
      <h1>Manage Events</h1>
      <div class="content">
        <h2>Future</h2>
        <div
          v-for="event in futureEvents"
          :key="event.id"
        >
          <hr>
          <EventListItem :event="event" />
        </div>

        <hr>
        <h2>Past</h2>
        <div
          v-for="event in pastEvents"
          :key="event.id"
        >
          <hr>
          <EventListItem :event="event" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { EventInfo } from "@/models";

import EventListItem from "@/components/admin/EventListItem.vue";

@Component({
  components: { EventListItem },
})
export default class Events extends Vue {
  get futureEvents(): EventInfo[] {
    return this.$store.getters["events/sortedFutureEvents"];
  }

  get pastEvents(): EventInfo[] {
    return this.$store.getters["events/sortedPastEvents"];
  }
}
</script>

<style lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#admin-console {
  @include std-size;
  @include shadow-box;
  @include std-position;
  color: black;

  hr {
    margin-top: 0.75em;
    margin-bottom: 0.75em;
    border-top: 1px solid darkgrey;
  }

  .content {
    margin-top: 0.25em;
  }

  .spacer {
    height: 10px;
    width: 10px;
  }

  .event {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    margin-right: auto;
    align-items: center;

    @media (min-width: 500px) {
      flex-wrap: nowrap;
      flex-direction: row;
    }

    .edit {
      margin: 10px;
    }

    .event-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 50%;

      @media (min-width: 500px) {
        flex-wrap: wrap;
        flex-direction: row;
        width: auto;
      }
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
}
</style>
