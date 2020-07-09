<template>
  <div
    class="date-form"
    @keyup="emit"
  >
    <input
      ref="month"
      v-model="month"
      class="input month"
      type="number"
      placeholder="mm"
      @input="updateMonth"
      @blur="month = month.padStart(2, 0)"
      @keydown="blockChar"
    >

    <span class="divider">/</span>

    <input
      ref="day"
      v-model="day"
      class="input day"
      type="number"
      placeholder="dd"
      @input="updateDay"
      @blur="day = day.padStart(2, 0)"
      @keydown="blockChar"
    >

    <span class="divider">/</span>
    <input
      ref="year"
      v-model="year"
      class="input year"
      type="number"
      placeholder="yy"
      @blur="year = year.padStart(2, 0)"
      @keydown="blockChar"
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import { PlainDate } from "@/models";

@Component
export default class DateForm extends Vue {
  // properties
  day: string = "";
  month: string = "";
  year: string = ""; // 20YY

  // setup
  @Prop() value!: PlainDate;

  mounted() {
    this.day = this.pad(this.value.day);
    this.month = this.pad(this.value.month);
    this.year = this.value.year.toString().substring(2, 4);
  }

  pad(num: number): string {
    return (num < 10 ? "0" + num : num).toString();
  }

  // validate data
  invalidChars = [".", "-", "+", "e"];
  blockChar(event: KeyboardEvent) {
    if (this.invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }

  @Watch("month")
  monthChanged(current: string, prev: string) {
    if (current == "00") {
      this.month = "01";
    }
    const num = parseInt(current);
    if (num > 12 || num < 0) {
      this.month = prev;
    }
  }

  @Watch("day")
  dayChanged(current: string, prev: string) {
    if (current == "00") {
      this.day = "01";
    }
    const max = this.daysInMonth(parseInt(this.month), parseInt(this.year));
    const num = parseInt(current);
    if (num > max || num < 0) {
      this.day = prev;
    }
  }

  @Watch("year")
  yearChanged(current: string, prev: string) {
    const num = parseInt(current);
    if (current.length > 2 || num < 0) {
      this.year = prev;
    }
  }

  daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  // move to next field
  updateMonth() {
    if (this.month.length == 0) {
      return;
    } else if (this.month.length == 1 && parseInt(this.month.charAt(0)) <= 1) {
      return;
    }

    this.select("day");
  }

  updateDay() {
    if (this.day.length == 0) {
      return;
    } else if (this.day.length == 1 && parseInt(this.day.charAt(0)) <= 3) {
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
  emit() {
    const year = parseInt("20" + this.year);
    const month = parseInt(this.month);
    const day = parseInt(this.day);
    return new PlainDate(day, month, year);
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/mixins.scss";
@import "@/shared-style/variables.scss";

.date-form {
  @include form-component;

  .input {
    padding-right: 0.25em;
    padding-left: 0.25em;
    border: none;
    text-align: center;
    width: 1.75em;

    // hide the spinner button in Chrome, Safari and Firefox.
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button {
      display: none;
    }
  }

  .divider {
    pointer-events: none;
  }
}
</style>
