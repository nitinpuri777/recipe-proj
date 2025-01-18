    import { html } from "../globals.js";

    const GenericModal = {
      template: html`
        <div class="modal row align_center width_fill height_fill position_fixed" :class="modalClasses">
          <!-- modal backdrop -->
          <div @click="hideModal" class="modal_overlay__backdrop"></div>
          <!-- modal content -->
          <div class="modal_overlay column bg_white border pad_16 gap_16 position_relative rounded_8px border_color_gray" :class="modalOverlayClasses">
            <div v-if="this.title.length > 0" class="row font_24">{{ title }}</div>
            
              <!-- Slot for custom content -->
              <div class="slot_container">
                <slot></slot>
              </div>
            <div class="row width_fill gap_fill pad_top_16">
              <div class="row width_fill gap_8 align_right">
                <button @click="hideModal" type="button" class="button__secondary rounded">Cancel</button>
                <button @click="emitConfirm" type="button" class="button rounded">{{confirmButtonText}}</button>
              </div>
            </div>
          </div>
        </div>
      `,
      props: {
        title: {
          type: String,
          default: ''
        },
        showModal: {
          type: Boolean,
          default: true
        },
        confirmButtonText: {
          type: String,
          default: 'Confirm'
        }
      },
      computed: {
        modalClasses() {
          if (this.showModal) {
            return ""
          }
          else {
            return "modal--hidden"
          }
        },
        modalOverlayClasses() {
          if (this.showModal) {
            return ""
          }
          else {
            return "modal_overlay--hidden"
          }
        },
      },
      methods: {
        hideModal() {
          this.$emit('close'); // Emit an event to close the modal
        },
        emitConfirm() {
          this.$emit('confirm'); // Emit save event with an optional payload
        }
      }
    }

    export default GenericModal;
