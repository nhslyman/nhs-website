<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Debounce } from "@/util";

@Component
export default class RezizeAuto extends Vue {
  resize(event: Event) {
    let target = event.target as HTMLInputElement;
    target.style.height = "auto";
    target.style.height = target.scrollHeight + 2 + "px"; // the +2 is to protect against 1px borders
  }

  @Debounce(50)
  resizeAuto() {
    let elem = this.$el as HTMLElement;
    elem.style.height = "auto";
    elem.style.height = elem.scrollHeight + 2 + "px";
  }

  mounted() {
    this.$nextTick(() => {
      let elem = this.$el as HTMLElement;
      elem.style.height = this.$el.scrollHeight + 2 + "px";
    });
    window.addEventListener("resize", this.resizeAuto);
  }

  render() {
    if (this.$scopedSlots?.default == null) {
      return;
    }
    return this.$scopedSlots.default({
      resize: this.resize
    });
  }
}
</script>
