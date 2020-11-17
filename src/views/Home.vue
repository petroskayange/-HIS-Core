<template>
  <ion-page>

    <ion-content :fullscreen="true">

      <div id="container">
        <ion-row>
          <ion-col>
            <ion-text  id="emr-title">
              <span id="emr-title-one">National</span>
              <br>
              <span id="emr-title-two">EMR</span> <span id="version-desc">Series 3</span>
            </ion-text>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <form novalidate>
              <ion-list>

                <ion-item>
                  <ion-label position="stacked" color="primary">Username</ion-label>
                  <ion-input
                      v-model="username"
                      name="username"
                      type="text"
                      spellcheck="false"
                      autocapitalize="off"
                      required
                  ></ion-input>
                </ion-item>

                <!--                <ion-text color="danger">-->
                <!--                  <p v-show="!usernameValid || submitted == true" padding-left>Username is required</p>-->
                <!--                </ion-text>-->

                <ion-item>
                  <ion-label position="stacked" color="primary">Password</ion-label>
                  <ion-input v-model="password" name="password" type="password" required></ion-input>
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


      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonLabel, IonInput, IonList, IonRow, IonCol, IonItem,
    IonText, IonButton
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {
    IonLabel,
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

.login-logo {
  padding: 20px 0;
  min-height: 200px;
  text-align: center;
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
</style>