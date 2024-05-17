import { html } from "../globals.js";

const AppHeader = {
  template: html`
    <div class="row width_fill border_bottom border_color_gray align_center_x">
      <div class="row max_width_1200px height_76px width_fill pad_left_16 pad_right_16 gap_32 align_center_y">
        <!-- Logo -->
        <div class="row width_240px shrink_none">
          <a href="/"><img src="/assets/logo.png" class="width_fill"></a>
        </div>
        <!-- End Logo -->
        <!-- Navigation Items -->
        <div class="row height_fill gap_32 pad_left_16 align_center_y fullWidthNavigationItems">
          <router-link :to="{path: '/app'}" class="font_20 font_bold pointer nav_link"> <div> Home <div> </router-link>
          <router-link :to="{path: '/app/shopping'}" class="font_20 font_bold pointer nav_link"> Shopping </router-link>
        </div>
        <!-- End navigation Items -->
        <!-- Sign Out -->
        <div class="row align_right width_fill">
          <div v-if="$store.isAuthenticated" class="row shrink_none align_center fullWidthNavigationItems">
            <a @click="signOut" class="pad_8 button__secondary font_bold rounded border">Sign Out</a>
          </div>
          <router-link :to="{path: '/app'}" v-if="!$store.isAuthenticated" class="row shrink_none align_center">
            <a class="pad_8 button__secondary font_bold rounded border">Sign In</a>
          </router-link>
        </div>
        <!-- End Sign Out -->
        <!-- Hamburger Menu (Mobile View) -->
        <div v-if="$store.isAuthenticated" class="row width_fill align_right mobile_navigation"> 
          <img src="/assets/icons/menu.svg" v-if="!this.isPanelVisible" class="width_32px height_32px icon" @click="togglePanel">  
          <img src="/assets/icons/x.svg" v-if="this.isPanelVisible" class="width_32px height_32px icon" @click="togglePanel">  
        </div>
          <div class="column gap_16 panel mobile_navigation border border_color_gray" :class="panelHiddenClasses">
            <!-- Add your links here -->
            <router-link :to="{path: '/app'}" class="font_32 font_bold pointer align_center_y row gap_8"> 
              <img src="/assets/icons/home.svg" class="width_24px height_24px">
              <div>Home </div>
            </router-link>
            <router-link :to="{path: '/app/shopping'}" class="font_32 font_bold pointer row gap_8"> 
            <img src="/assets/icons/shopping-cart.svg" class="width_24px height_24px">  
            <div> Shopping </div>
            </router-link>
            <div @click="signOut" class="font_32 font_bold pointer row gap_8">
            <img src="/assets/icons/log-out.svg" class="width_24px height_24px">
            <div> Sign Out </div>
            </div>
            <!-- etc. -->
          </div>
      </div>
    </div>`,
  methods: {
    signOut() {
      this.$store.signOut(); // Call the signOut action defined in your store
    },
    signIn() {
      this.$store.goToSignIn(this.$route.path);
    },
    togglePanel() {
      this.isPanelVisible = !this.isPanelVisible
    }
  },
  data() {
    return {
     isPanelVisible: false
    }
  },
  computed:{
    panelHiddenClasses() {
      if(!this.isPanelVisible) {
        return 'panel--hidden'
      }
      else {
        return ''
      }
    }
  }
}

export default AppHeader
