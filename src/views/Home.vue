<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container" class="main">
        <!-- Title -->
        <ion-row>
          <ion-col>
            <ion-text>
              <span id="emr-title">
              <span id="emr-title-one">National</span>
              <br>
              <span id="emr-title-two">EMR</span> <span id="version-desc">Series 3</span>
              </span>
            </ion-text>
          </ion-col>
        </ion-row>
        <!-- Form -->
        <ion-row>
          <ion-col>
            <form novalidate>
              <ion-list>
                <ion-item>
                  <ion-input
                      v-model="username"
                      name="username"
                      type="text"
                      spellcheck="false"
                      autocapitalize="off"
                      required
                      class="login_input"
                      placeholder="Username"
                  ></ion-input>
                </ion-item>

                <!--                <ion-text color="danger">-->
                <!--                  <p v-show="!usernameValid || submitted == true" padding-left>Username is required</p>-->
                <!--                </ion-text>-->

                <ion-item>
                  <ion-input v-model="password" name="password" type="password" required placeholder="Password" class="login_input"></ion-input>
                </ion-item>

                <!--                <ion-text color="danger">-->
                <!--                  <p v-show="!passwordValid || submitted == true" padding-left>Password is required</p>-->
                <!--                </ion-text>-->
              </ion-list>

              <ion-row responsive-sm>
                <!--                <ion-col>-->
                <!--                  <ion-button @click="onSignup()" color="light" expand="block">Signup</ion-button>-->
                <!--                </ion-col>-->
                <ion-col>
                  <ion-button @click="onLogin(loginForm)" type="submit" expand="block">Login</ion-button>
                </ion-col>
              </ion-row>
            </form>
          </ion-col>
        </ion-row>
        <!-- Logos -->
        <ion-row>
          <ion-col>
            <div>
              <span class="logos">
                <img id="coat-of-arms" src="/assets/images/login-logos/Malawi-Coat_of_arms_of_arms.png" alt="Malawi Coat of Arms logo"/>
              </span>
              <span class="logos">
                <img class="other-logos" src="/assets/images/login-logos/PEPFAR.png"  alt="PEPFAR logo"/>
              </span>
            </div>
          </ion-col>
        </ion-row>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonInput, IonList, IonRow, IonCol, IonItem,
  IonText, IonButton
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {
    IonList,
    IonRow,
    IonCol,
    IonItem,
    IonButton,
    IonInput,
    IonContent,
    IonPage,
    IonText
  },
  data() {
    return {
      username: '',
      password: '',
      submitted: false,
    }
  },
  get usernameValid() {
    return true;
  },
  get passwordValid() {
    return true;
  },
  onLogin(ev: any) {
    ev.preventDefault();
  }
});
</script>

<style scoped>
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

.inputs {
  height: 75vh;
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
  text-shadow: 0 2px 0 rgba(255,255,255,0.8);
  box-shadow: 0 1px 0 rgba(255,255,255,0.8);
  text-transform: uppercase;
}

#emr-title-one {
  color: #8B4513;
}

#emr-title-two {
  color: #CD853F;
}

#version-desc {
  font-size: 15px;
  margin-left: 5px;
}

.login_input {
  border: 1px solid #ccc;
  border-radius: 5px;
  width: calc(100% - 30px);
  font-family: Nimbus Sans L,Arial Narrow,sans-serif;
  font-size: 2.2em;
  background-color: lightgrey;
  color: #000;
  padding: 5px;
  margin-bottom: 5px;
  border: 1px solid #8B4513;
  border-radius: 5px;
}

#login-btn {
  margin: 5px 0px 0px;
  margin-right: 0px;
  height: 60px;
  float: right;
  font-size: 2rem;
  border: 1px solid #7eb9d0;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  font-size: 28px;
  font-family: arial, helvetica, sans-serif;
  padding: 10px 10px 10px 10px;
  text-decoration: none;
  display: inline-block;
  text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.3);
  font-weight: bold;
  color: #FFFFFF;
  background-color: #36780f;
  background-image: -webkit-gradient(linear, left top, left bottom, from(#36780f), to(#005900));
  background-image: -webkit-gradient(linear, left top, left bottom, from(#4ba614), to(#008c00));
  background-image: -webkit-linear-gradient(top, #4ba614, #008c00);
  background-image: -moz-linear-gradient(top, #4ba614, #008c00);
  background-image: -ms-linear-gradient(top, #4ba614, #008c00);
  background-image: -o-linear-gradient(top, #4ba614, #008c00);
  background-image: linear-gradient(to bottom, #4ba614, #008c00);
  filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0, startColorstr=#a7cfdf, endColorstr=#23538a);
  margin-right: 10px;
}

#coat-of-arms {
  height: 160px !important;
  width: 160px !important;
}

.other-logos {
  bottom: -70px !important;
  position: relative;
}
</style>