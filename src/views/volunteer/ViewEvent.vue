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
          <h3>Shift(s):</h3>
          <div
            v-for="shift in event.shifts"
            :key="shift.id"
          >
            <ShiftOption
              :shift="shift"
              :event="event"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { EventInfo } from "@/models";
import marked from "marked";
import { Optional, Dict } from "@/util";

import ShiftOption from "@/components/volunteer/ShiftOption.vue";

@Component({
  components: { ShiftOption },
})
export default class ViewEvent extends Vue {
  // get selected event
  get event(): Optional<EventInfo> {
    return this.events[this.id];
  }

  get id(): string {
    return this.$route.params["id"];
  }

  get events(): Dict<EventInfo> {
    return this.$store.getters["events/eventsDict"];
  }

  // rendered details markdown
  get details() {
    if (this.event == null) {
      return "";
    }
    marked.setOptions({
      renderer: this.renderer, // opens link in new tab
    });
    return marked(this.event.details);
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
}
</style>
