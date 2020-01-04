<template>
  <div class="date-form" @keyup.capture="updateValue">
    <input
      ref="month"
      v-model="month"
      class="input month"
      type="number"
      placeholder="mm"
      @input="updateMonth"
      @blur="month = month.padStart(2, 0)"
    />

    <span class="divider">/</span>

    <input
      ref="day"
      v-model="day"
      class="input day"
      type="number"
      placeholder="dd"
      @input="updateDay"
      @blur="day = day.padStart(2, 0)"
    />

    <span class="divider">/</span>
    <input
      ref="year"
      v-model="year"
      class="input year"
      type="number"
      placeholder="yy"
      @blur="year = year.padStart(2, 0)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";

@Component
export default class DateForm extends Vue {
  // properties
  day: string = "";
  month: string = "";
  year: string = ""; // 20YY

  // setup
  @Prop() value!: Date;

  mounted() {
    this.day = this.pad(this.value.getDate());
    this.month = this.pad(this.value.getMonth() + 1);
    this.year = this.value
      .getFullYear()
      .toString()
      .substring(2, 4);
  }

  pad(num: number): string {
    return (num < 10 ? "0" + num : num).toString();
  }

  // validate data
  @Watch("month")
  monthChanged(current: string, prev: string) {
    if (Number.parseInt(current) > 12) this.month = prev;
  }

  @Watch("day")
  dayChanged(current: string, prev: string) {
    const max = this.daysInMonth(
      Number.parseInt(this.month),
      Number.parseInt(this.year)
    );
    if (Number.parseInt(current) > max) this.day = prev;
  }

  @Watch("year")
  yearChanged(current: string, prev: string) {
    if (current.length > 2) {
      this.year = prev;
    }
  }

  daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  // move to next field
  updateMonth() {
    if (!this.month.length || parseInt(this.month) < 2) {
      return;
    }

    this.select("day");
  }

  updateDay() {
    if (!this.day.length || parseInt(this.day) < 4) {
      return;
    }

    this.select("year");
  }

  select(field: string) {
    const monthField = this.$refs[field] as HTMLInputElement;
    monthField.select();
  }

  // emiting
  @Emit("input")
  updateValue() {
    const year = Number.parseInt("20" + this.year);
    const month = Number.parseInt(this.month) - 1;
    const day = Number.parseInt(this.day);
    return new Date(year, month, day);
  }
}
</script>

<style scoped lang="scss">
.date-form {
  $spacing: 0.5em;
  display: inline-flex;
  position: relative;
  overflow: hidden;
  border: 1px solid #888;
  border-radius: 0.25em;
  background-color: white;

  .input {
    padding: $spacing;
    padding-right: $spacing / 2;
    padding-left: $spacing / 2;
    border: none;
    text-align: center;
    width: 2em;

    &:first-child {
      padding-left: $spacing;
    }

    &:last-child {
      padding-right: $spacing;
    }

    // hide the spinner button in Chrome, Safari and Firefox.
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button {
      display: none;
    }
  }

  .divider {
    padding-top: $spacing;
    padding-bottom: $spacing;
    pointer-events: none;
  }
}
</style>
