<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-row>
          <ion-col>
            <ion-text>
              <span id="emr-title">
                <span id="emr-title-one">National </span>
                <!-- <br> -->
                <span id="emr-title-two">EMR</span>
                <span id="version-desc">Series 3</span>
              </span>
            </ion-text>
          </ion-col>
        </ion-row>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" :fullscreen="true">
      <ion-row>
        <ion-col>
          <form novalidate>
            <ion-list class="get-centered">
              <ion-item>
                <ion-input
                  v-model="username"
                  name="username"
                  ref="username"
                  type="text"
                  spellcheck="false"
                  autocapitalize="off"
                  required
                  class="login_input"
                  placeholder="Username"
                  @ionFocus="doSomething('username')"
                ></ion-input>
              </ion-item>
              <!-- TODO: make this info message for when login was attempted without username entered. -->
              <ion-text color="danger">
                <p v-show="!validateUsername" padding-left>Username is required</p>
              </ion-text>

              <ion-item>
                <ion-input
                  ref="password"
                  v-model="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  @ionFocus="doSomething('password')"
                  class="login_input"
                >
                </ion-input>
              </ion-item>
              <!-- TODO: make this info message for when login was attempted without password entered. -->
              <ion-text color="danger">
                <p v-show="!validatePassword" padding-left>Password is required</p>
              </ion-text>
            </ion-list>
          </form>
        </ion-col>
      </ion-row>

      <keyboard
        @inputChar="dosomethingElse"
        :val="this[active]"
        v-if="active"
        :custom="customButton"
        @doLogin="doLogin"
        :position="currentHeight"
        @nextEvent="goToNextField"
      >
      </keyboard>
    </ion-content>
    <ion-footer>
      <span class="logos" id="coat">
        <img
          id="coat-of-arms"
          src="/assets/images/login-logos/Malawi-Coat_of_arms_of_arms.png"
          alt="Malawi Coat of Arms logo"
        />
      </span>
      <span class="logos" id="pepfar">
        <img
          class="other-logos"
          src="/assets/images/login-logos/PEPFAR.png"
          alt="PEPFAR logo"
        />
      </span>
    </ion-footer>

    <!-- <ion-footer>
    <ion-toolbar>
      Footer
    </ion-toolbar>
  </ion-footer> -->
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonInput,
  IonList,
  IonRow,
  IonCol,
  IonItem,
  IonText,
  IonFooter,
  IonToolbar,
  IonHeader,
  IonPage,
  toastController
} from "@ionic/vue";
import { defineComponent } from "vue";
import keyboard from "../../components/Keyboard/qwerty.vue";
import ApiClient from "@/services/api_client"
export default defineComponent({
  // emits: ['input-char'],
  name: "Home",
  components: {
    IonList,
    IonRow,
    IonCol,
    IonItem,
    // IonButton,
    IonInput,
    IonContent,
    IonPage,
    IonText,
    IonFooter,
    IonToolbar,
    IonHeader,
    keyboard,
  },
  data() {
    return {
      username: "",
      password: "",
      active: null,
      submitted: false,
      usernameValid: false,
      passwordValid: false,
      minUsernameLength: 4,
      minPasswordLength: 4,
      customButton: {
        name: "login",
        action: "doLogin",
      },
      currentHeight:  null,
    };
  },
  computed: {
    validateUsername() {
      if (!this.username || this.username.length < this.minUsernameLength) {
        return false;
      }
      return true;
    },
    validatePassword() {
      if (!this.password || this.password.length < this.minPasswordLength) {
        return false;
      }
      return true;
    }
  },
  methods: {
    doSomething(e) {
      const top = this.$refs[e].$el.getBoundingClientRect().top;
      this.currentHeight = top;
      this.active = e;
    },
    dosomethingElse(e) {
      this[this.active] = e;
    },
    goToNextField() {
      const nextField = this.active === 'username' ? 'password' : 'username';
      this.doSomething(nextField);
    },
    async showMessage(message) {
       const toast = await toastController
        .create({
          message: message,
          position: 'top',
          animated: true,
          duration: 4000
        })
      return toast.present();
    },
    doLogin: async function(){
       const params = { username: this.username.toLowerCase(), password: this.password.toLowerCase() };
      const response = await ApiClient.post("auth/login", params, 
        [401]
      ).catch((error) => {
        console.log(error);
      });

      if (response.status === 200) {
        const {
          authorization: { token, user }
        } = await response.json();
        sessionStorage.setItem("apiKey", token);
        sessionStorage.setItem("username", user.username);
        sessionStorage.setItem("userID", user.user_id);
        this.$router.push("/");
      } else if (response.status === 401){
        this.showMessage("Invalid username or password")
        return;
      }else {

        this.showMessage("An error has occured")
        console.warn(`Response: ${response.status} - ${response.body}`);
      }
      //validate password and username here
      // if (!(this.validateUsername && this.validatePassword)) {

      //       console.log("no logged in");
      //         return;
      // }

      console.log("logged in");
    },
  },
  onLogin(ev) {
    ev.preventDefault();
  },
});
</script>

<style scoped>
ion-footer {
  background-color: white;
}
ion-input {
  margin: 5%;
}
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}
#coat {
  /* position: fixed; */
  /* bottom: 0; */
  /* left: 0; */
  float: left;
}

#pepfar {
  /* position: fixed; */
  /* bottom: 0; */
  /* right: 0; */
  float: right;
}
#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}

.main {
  display: table;
  width: 100%;
  border: 1px solid black;
  height: 97vh;
  /*background-image: url("/assets/images/login-logos/Malawi-Coat_of_arms_of_arms.png");
  background-repeat: no-repeat;
  background-position: center;*/
}

.get-centered {
  text-align: center;
}

.logos img {
  width: 90px;
  height: 90px;
  margin-left: 10px;
  float: left;
}

.login-logo img {
  max-width: 150px;
}

.list {
  margin-bottom: 0;
}

#emr-title {
  font-size: 60px;
  font-weight: bold;
  color: #bdb5aa;
  padding-bottom: 8px;
  text-shadow: 0 2px 0 rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
  /* text-transform: uppercase; */
}

#emr-title-one {
  color: #8b4513;
}

#emr-title-two {
  color: #cd853f;
}

#version-desc {
  font-size: 15px;
  margin-left: 5px;
}

.login_input {
  border: 1px solid #ccc;
  border-radius: 5px;
  width: calc(100% - 30px);
  font-family: Nimbus Sans L, Arial Narrow, sans-serif;
  font-size: 2.2em;
  background-color: lightgrey;
  color: #000;
  padding: 5px;
  margin-bottom: 5px;
  border: 1px solid #8b4513;
  border-radius: 5px;
}

#coat-of-arms {
  /* height: 100px !important;
  width: 100px !important; */
}

.other-logos {
  /* bottom: 0px !important; */
  /* position: relative; */
  /* right: 0; */
}
</style>