<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>E-Mastercard v4</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">E-Mastercard v4</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-row>
          <!-- Left sidebar for image -->
          <ion-col>
            <div class="login-logo">
              <img src="/assets/egpaf.jpg" alt="E-Mastercard Logo">
            </div>
          </ion-col>
          <!-- Right sidebar for form -->
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
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonInput, IonList, IonRow, IonCol, IonItem,
  IonButton
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
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
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
</style>