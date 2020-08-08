<template>
  <div id="event-editor"> 
    <div class="group">
      <label for="name">
        <h2>Name</h2>
      </label>
      <input
        v-model="event.name"
        type="text"
        class="form-control name-editor"
        name="name"
        placeholder="Name"
      >
    </div>

    <div class="group">
      <label for="blurb">
        <h2>Blurb</h2>
      </label>

      <div>
        <ResizeAuto>
          <template v-slot:default="{ resize }">
            <textarea
              ref="blurb"
              v-model="event.blurb"
              class="form-control"
              name="blurb"
              @input="resize"
            />
          </template>
        </ResizeAuto>
      </div>
    </div>

    <div class="group">
      <label for="details">
        <h2>Details</h2>
      </label>

      <div>
        <MDEditor v-model="event.details" />
        <p>Please don't use headings (#...) here.</p>
      </div>
    </div>

    <div class="group">
      <label for="shifts">
        <h2>Shifts</h2>
      </label>

      <div>
        <ShiftsEditor v-model="event.shifts" />
      </div>

      <div>
        <input
          v-model="event.wholeShift"
          type="checkbox"
          name="wholeShift"
        >
        <label for="wholeShift"> Must Attend Entire Shift</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import { EventInfo } from "@/models";

import MDEditor from "@/components/inputs/MDEditor.vue";
import ShiftsEditor from "@/components/admin/ShiftsEditor.vue";
import ResizeAuto from "@/components/util/ResizeAuto.vue";

@Component({
  components: {
    MDEditor,
    ShiftsEditor,
    ResizeAuto,
  },
})
export default class EventEditor extends Vue {
  // displayed value
  event: EventInfo = EventInfo.empty;

  // value from parent
  @Prop() value!: EventInfo;

  mounted() {
    this.event = this.value;
  }

  @Watch("value")
  valueChanged(value: EventInfo) {
    this.event = value;
  }

  // emiting
  @Watch("event")
  @Emit("input")
  emit() {
    return this.event;
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/variables.scss";
@import "@/shared-style/mixins.scss";

#event-editor {
  .name-editor {
    width: 100%;
  }

  textarea {
    @include rounded;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    font-size: 15px;
    background-color: $insetEditor;
    width: 100%;
    resize: none;
    box-sizing: border-box;
    padding: 10px 20px;
    border: 1px solid $boarderColor;
  }

  .group {
    margin-bottom: 1em;
  }
}
</style>
