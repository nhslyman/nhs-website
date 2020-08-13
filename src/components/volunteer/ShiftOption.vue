<template>
  <div class="shift">
    <input
      v-model="localSelected"
      type="checkbox"
      :value="shift.id"
      :disabled="locked"
    >
    <strong>{{ shift.time.humanReadable }}</strong>
    <div class="attendance">
      <p>Signed Up: {{ shift.signedUp.length }}</p>
      <p>Target: {{ shift.target }}</p>
      <p
        v-if="shift.max != 0"
        :class="{ 'bold':(shift.signedUp.length >= shift.max) }"
      >
        Maximum: {{ shift.max }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import { Shift, PlainDate, ShiftState } from "@/models";
import { Optional } from '@/util';

@Component
export default class ViewEvent extends Vue {
  // set by parent
  @Prop() shift!: Shift
  @Prop() signedUp!: boolean

  // synced back
  localSelected: string[] = [];
  @Prop() selected!: string[]

  mounted() {
    this.localSelected = this.selected;
  }

  @Watch("selected")
  selectedChanged(selected: string[]) {
    this.localSelected = selected;
  }

  @Watch("localSelected")
  @Emit("input")
  emit() {
    return this.localSelected;
  }

  // if checkbox is disabled
  get locked() {
    return this.signedUp
          || this.dateToLate
          || this.full;
  }

  get full() {
    return this.shift.max != 0 && (this.shift.signedUp.length >= this.shift.max);
  }

  get dateToLate(): boolean {
    return this.shift.state != ShiftState.Open;
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

  h3 {
    width: 100%;
    margin-bottom: 0.5em;
  }

  strong {
    padding-left: 0.25em;
  }

  .unregister {
    @include scary-button-color;
  }

  .disabled {
    background-color: gray;

    &:hover {
      background-color: gray;
    }
  }

  .too-late-text {
    margin-top: 1.75em;
    width: 80%;
    text-align: center;
    margin-left: auto;
    margin-right: auto;

    p {
      padding-bottom: 0.5em;
    }

    @media (min-width: $maxMobileSize) {
      width: 60%;
    }
  }

  .bold {
    font-weight: bold;
  }
}
</style>
