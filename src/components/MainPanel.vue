<template>
  <div id="app" width: auto>
    <v-row>
      <v-col>
        <div id="inspire">
          <v-stepper v-model="e1" vertical>
            <v-stepper-header>
              <v-stepper-step :complete="e1 > 1" step="1">
                Personal data
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="e1 > 2" step="2">
                QR code
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3"> Confirmation </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-form ref="personalDataForm" @submit.prevent>
                  <div>
                    <v-text-field
                      v-model="firstName"
                      label="First name"
                      prepend-icon="mdi-account-edit"
                      :rules="firstNameRules"
                    />
                  </div>
                  <div>
                    <v-text-field
                      v-model="lastName"
                      label="Last name"
                      prepend-icon="mdi-account-edit"
                      :rules="lastNameRules"
                    />
                  </div>
                  <div>
                    <v-text-field
                      v-model="birthDateFormatted"
                      label="Birthday date"
                      prepend-icon="mdi-calendar"
                      readonly
                      :rules="birthDateFormattedRules"
                      @click="dateDialogVisible = true"
                    />
                  </div>
                  <v-dialog v-model="dateDialogVisible" width="500">
                    <v-card>
                      <div class="d-flex flex-column">
                        <v-date-picker
                          v-model="birthDate"
                          :active-picker.sync="activeBirthDatePicker"
                          :min="minBirthDate"
                          :max="maxBirthDate"
                        />
                        <v-btn @click="dateDialogVisible = false">Close</v-btn>
                      </div>
                    </v-card>
                  </v-dialog>
                </v-form>
                <v-row
                  align="center"
                  justify="space-around"
                  class="row-buttons"
                >
                  <v-btn text @click="clearData"> Cancel </v-btn>
                  <v-btn color="primary" @click="submitPersonalData">
                    Continue
                  </v-btn>
                </v-row>
              </v-stepper-content>

              <v-stepper-content step="2">
                <div v-if="isQrcodeReaderVisible">
                  <qrcode-reader @setQrCodeString="setQrCodeString" />
                </div>
                <v-row
                  align="center"
                  justify="space-around"
                  class="row-buttons"
                >
                  <v-btn color="primary" @click="toStep1"> Back </v-btn>
                </v-row>
              </v-stepper-content>

              <v-stepper-content step="3">
                <div>
                  <v-text-field
                    v-model="firstName"
                    label="First name"
                    readonly
                  />
                </div>
                <div>
                  <v-text-field v-model="lastName" label="Last name" readonly />
                </div>
                <div>
                  <v-text-field
                    v-model="birthDateFormatted"
                    label="Birthday date"
                    readonly
                  />
                </div>
                <v-row
                  align="center"
                  justify="space-around"
                  class="row-buttons"
                >
                  <v-btn text @click="clearData"> Cancel </v-btn>
                  <v-btn color="primary" @click="saveData"> Save </v-btn>
                </v-row>
                <v-dialog v-model="successDialogVisible" width="200">
                  <v-card>
                    <v-alert type="success" prominent text>Data saved</v-alert>
                    <div class="d-flex flex-column">
                      <v-btn @click="toNewInput"> Ok </v-btn>
                    </div>
                  </v-card>
                </v-dialog>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { saveObject } from '@/helpers/common';

import QrcodeReader from './QrcodeReader.vue';

export default {
  name: 'MainPanel',
  components: { QrcodeReader },
  data: () => ({
    e1: 1,
    firstName: '',
    lastName: '',
    birthDate: null,
    birthDateFormatted: null,
    minBirthDate: '1950-01-01',
    maxBirthDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    activeBirthDatePicker: null,
    qrCodeString: '',
    dateDialogVisible: false,
    isQrcodeReaderVisible: false,
    successDialogVisible: false,
    firstNameRules: [(v) => !!v || 'Is required'],
    lastNameRules: [(v) => !!v || 'Is required'],
    birthDateFormattedRules: [(v) => !!v || 'Is required'],
  }),
  watch: {
    dateDialogVisible(val) {
      val && setTimeout(() => (this.activeBirthDatePicker = 'YEAR'));
    },
    birthDate(val) {
      this.birthDateFormatted = this.formatDate(this.birthDate);
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split('-');
      return `${day}-${month}-${year}`;
    },
    clearData() {
      this.$refs['personalDataForm'].reset();
      this.birthDate = null;
      this.qrCodeString = '';
      this.toStep1();
    },
    submitPersonalData() {
      const isValid = this.$refs['personalDataForm'].validate();
      if (!isValid) {
        return;
      } else {
        this.e1 = 2;
        this.isQrcodeReaderVisible = true;
      }
    },
    toStep1() {
      this.e1 = 1;
    },
    toNewInput() {
      this.successDialogVisible = false;
      this.clearData();
    },
    setQrCodeString(qrCodeString) {
      this.qrCodeString = qrCodeString;
      this.e1 = 3;
    },
    saveData() {
      const obj = {
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: this.birthDate,
        qrCodeString: this.qrCodeString,
      };
      const prms = saveObject(obj);
      prms
        .then((response) => {
          if (response.status == 200) {
            this.successDialogVisible = true;
          } else {
			alert('An error has occurred');
          }
        })
        .catch((error) => {
		  alert(error);
        });
    },
  },
};
</script>

<style scoped>
.row-buttons {
  height: 75px;
}
</style>
