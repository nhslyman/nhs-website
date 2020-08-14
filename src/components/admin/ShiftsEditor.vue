<template>
  <div
    id="shift-editor"
    @keyup="emit"
  >
    <div class="action-button new">
      <button @click="newShift()">
        <p>New Shift</p>
      </button>
    </div>

    <div
      v-for="(shift, index) in shifts"
      :key="shift.id"
      class="shift"
    >
      <div class="fields">
        <div class="group">
          <label for="date">
            <h3>Date</h3>
          </label>
          <div>
            <DateForm
              v-model="shift.time.day"
              name="date"
            />
          </div>
        </div>

        <div class="group">
          <label for="start-time">
            <h3>Start Time</h3>
          </label>
          <div>
            <TimeForm
              v-model="shift.time.startTime"
              name="start-time"
            />
          </div>
        </div>

        <div class="group">
          <label for="end-time">
            <h3>End Time</h3>
          </label>
          <div>
            <TimeForm
              v-model="shift.time.endTime"
              name="end-time"
            />
          </div>
        </div>

        <div class="group">
          <label for="target">
            <h3>Target</h3>
          </label>
          <div>
            <input
              v-model="shift.target"
              class="numberIn"
              type="number"
              inputmode="numeric"
              pattern="[0-9]*"
              name="target"
              min="0"
              @keydown="blockChar"
            >
          </div>
        </div>

        <div class="group">
          <label for="max">
            <h3>Max</h3>
          </label>
          <div>
            <input
              v-model="shift.max"
              class="numberIn"
              type="number"
              inputmode="numeric"
              pattern="[0-9]*"
              name="max"
              min="0"
              @keydown="blockChar"
            >
          </div>
        </div>
      </div>

      <div class="action-button delete">
        <button @click="removeShift(index)">
          <p>Delete Shift</p>
        </button>
      </div>
    </div>
    <p class="disclaimer">
      If no max, put 0
    </p>
    <br>
    <p class="disclaimer">
      (Shifts are sorted automatically on save)
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import marked from "marked";
import { Shift, ShiftTime, Time, PlainDate } from "@/models";
import DateForm from "@/components/inputs/DateForm.vue";
import TimeForm from "@/components/inputs/TimeForm.vue";

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

  // validate input
  invalidChars = [".", "-", "+", "e"];
  blockChar(event: KeyboardEvent) {
    if (this.invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }

  // shift management
  newShift() {
    const date = PlainDate.now();
    const time = new Time(12, 0, false);
    const shiftTime = new ShiftTime(date, time, time);
    const shift = new Shift(shiftTime, [], 0, 0);
    this.shifts.push(shift);
  }

  removeShift(index: number) {
    if (confirm("Are you sure you want to delete this shift?")) {
      this.$delete(this.shifts, index);
    }
  }

  // emiting
  @Watch("shifts")
  @Emit("input")
  emit() {
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
    padding: 1em 1em;
    margin-bottom: 1.25em;

    .fields {
      display: inline-flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-evenly;

      .group {
        display: inline;
        margin: 0.25em 0.5em;
      }
    }

    .numberIn {
      @include form-component;
      width: 5em;
      text-align: center;
    }
  }

  .action-button {
    @include button;

    p {
      color: white;
      padding: 0.25em;
    }

    &.delete {
      @include scary-button-color;
      margin-top: 1em;
      margin-left: auto;
      margin-right: auto;
    }

    &.new {
      margin-bottom: 0.75em;
    }
  }

  .disclaimer {
    float: right;
  }
}
</style>
