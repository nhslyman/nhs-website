<template>
  <div
    v-if="event"
    id="event-users"
  >
    <div class="inside">
      <h1>Users Signed Up For {{ event.name }}</h1>
      <div
        v-for="shift in event.shifts"
        id="shift-section"
        :key="shift.id"
      >
        <h2> {{ shift.time.humanReadable }} </h2>
        <div
          v-for="userId in shift.signedUp"
          :key="userId"
        >
          <p>{{ nameFromID(userId) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { deepCopy } from "@/util";
import { plainToClass } from "class-transformer";

import { EventInfo, UserAttributes } from "@/models";

interface EventDict {
  [key: string]: EventInfo;
}

interface UserDict {
  [key: string]: UserAttributes;
}

@Component
export default class NewEvent extends Vue {
  private editedEvent: EventInfo | null = null

  get selectedID() {
    return this.$route.params["id"]
  }

  get event() {
    let eventDict = this.$store.getters["events/eventsDict"] as EventDict;
    return eventDict[this.selectedID];
  }

  get usersDict(): UserDict {
    return this.$store.getters["users/usersDict"]
  }

  nameFromID(id: string): string {
    return this.usersDict[id].fullName;
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#event-users {
  @include shadow-box;
  @include std-size;
  @include std-position;

  #shift-section {
    margin-bottom: 1em;
  }
}
</style>
