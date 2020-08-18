<template>
  <div id="admin-console">
    <div class="inside">
      <div id="title-row">
        <h1>Manage Events</h1>
        <div id="new-button">
          <router-link :to="'/admin/events/new/'">
            <p>New Event</p>
          </router-link>
        </div>
      </div>
      
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

  .content {
    @media (min-width: 500px) {
      margin-top: 0.5em;
    }

    margin-top: 1.5em;
  }

  #title-row {
    @media (min-width: 500px) {
      height: 3em;

      h1 {
        float: left;
      }

      #new-button {
        float: right;
      }
    }

    #new-button {
      @include button;

      a {
        color: white;
        text-decoration: none;
      }
    }
  }
}
</style>
