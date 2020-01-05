<template>
  <div id="shift-editor" @keyup.capture="updateValue">
    <div v-for="shift in shifts" :key="shift.id" class="shift">
      <div class="group">
        <label for="date">
          <h3>Date</h3>
        </label>
        <div>
          <DateForm v-model="shift.time.day" name="date" />
        </div>
      </div>

      <div class="group">
        <label for="start-time">
          <h3>Start Time</h3>
        </label>
        <div>
          <TimeForm v-model="shift.time.startTime" name="start-time" />
        </div>
      </div>

      <div class="group">
        <label for="end-time">
          <h3>End Time</h3>
        </label>
        <div>
          <TimeForm v-model="shift.time.endTime" name="end-time" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import marked from "marked";
import { Shift } from "@/models";
import DateForm from "@/components/DateForm.vue";
import TimeForm from "@/components/TimeForm.vue";

@Component({
  components: {
    DateForm,
    TimeForm
  }
})
export default class ShiftsEditor extends Vue {
  // displayed value
  shifts: Shift[] = [];

  // value from parent
  @Prop() value!: Shift[];

  mounted() {
    this.shifts = this.value;
  }

  @Watch("value")
  valueChanged(value: Shift[]) {
    this.shifts = value;
  }

  @Watch("shifts")
  @Emit("input")
  update() {
    return this.shifts;
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/mixins.scss";
@import "@/shared-style/variables.scss";

#shift-editor {
  .shift {
    @include rounded;
    background-color: $insetEditor;
    border: 1px solid #ccc;
    box-sizing: border-box;
    padding: 10px 20px;
    margin-bottom: 1.25em;
    display: flex;
    flex-wrap: wrap;

    .group {
      margin: 0 1em 0.5em 1em;
    }
  }
}
</style>
