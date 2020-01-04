<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class RezizeAuto extends Vue {
  resize(event: Event) {
    let target = event.target as HTMLInputElement;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  }

  mounted() {
    this.$nextTick(() => {
      let elem = this.$el as HTMLElement;
      elem.style.height = `${this.$el.scrollHeight}px`;
    });
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
