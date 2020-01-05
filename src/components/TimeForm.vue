<template>
  <div class="date-form" @keyup.capture="updateValue">
    <input
      ref="hour"
      v-model="hour"
      class="input hour"
      type="number"
      placeholder="hh"
      @input="updateHour"
    />

    <span class="divider">:</span>

    <input
      ref="minute"
      v-model="minute"
      class="input minute"
      type="number"
      placeholder="mm"
      @blur="minute = minute.padStart(2, 0)"
    />

    <button
      class="input period"
      @click="
        am = !am;
        updateValue();
      "
    >
      <p>{{ am ? "AM" : "PM" }}</p>
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import { Time } from "@/models";

@Component
export default class TimeForm extends Vue {
  // properties
  hour: string = "";
  minute: string = "";
  am: boolean = false;

  // setup
  @Prop() value!: Time;

  mounted() {
    this.hour = this.value.hour.toString();
    this.minute = this.value.mm.toString();
    this.am = this.value.am;
  }

  pad(num: number): string {
    return (num < 10 ? "0" + num : num).toString();
  }

  // validate data
  @Watch("hour")
  hourChanged(current: string, prev: string) {
    if (parseInt(current) > 12) this.hour = prev;
  }

  @Watch("day")
  minuteChanged(current: string, prev: string) {
    if (parseInt(current) > 59) this.minute = prev;
  }

  // move to next field
  updateHour() {
    if (this.hour.length == 0) {
      return;
    } else if (this.hour.length == 1 && this.hour.charAt(0) == "1") {
      return;
    }

    this.select("minute");
  }

  select(field: string) {
    const monthField = this.$refs[field] as HTMLInputElement;
    monthField.select();
  }

  // emiting
  @Emit("input")
  updateValue() {
    const hour = parseInt(this.hour);
    const minute = parseInt(this.minute);
    return new Time(hour, minute, this.am);
  }
}
</script>

<style scoped lang="scss">
@import "@/shared-style/mixins.scss";
@import "@/shared-style/variables.scss";

.date-form {
  @include form-component;

  .input {
    border: none;
    text-align: center;
    width: 1.5em;

    &.hour {
      text-align: right;
      padding-right: 0.15em;
    }

    &.minute {
      text-align: left;
      padding-left: 0.15em;
    }

    &.period {
      text-align: left;
      width: 2em;
    }

    // hide the spinner button in Chrome, Safari and Firefox.
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button {
      display: none;
    }
  }

  .divider {
    pointer-events: none;
    position: relative;
    top: -0.07em; // center colon
  }
}
</style>
