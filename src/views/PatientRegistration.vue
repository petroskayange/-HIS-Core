<template>
  <his-standard-form :fields="fields" @onSubmit="onSubmit" @onFinish="onFinish"/>
</template> 

<script lang="ts">
import { defineComponent } from "vue";
import { FieldType } from "@/components/Forms/BaseFormElements"
import { Field } from "@/components/Forms/FieldInterface"
import HisStandardForm from "@/components/Forms/HisStandardForm.vue";
import MonthOptions from "@/components/FormElements/Presets/MonthOptions"
import Validation from "@/components/Forms/validations/StandardValidations"
import moment from "moment"

export default defineComponent({
  components: { HisStandardForm },
  data: () => ({
    fields: [] as Array<Field>
  }),
  created(){
    this.fields = this.getFields()
  },
  methods: {
    onFinish(formData: any) {
      console.log(formData)
    },
    onSubmit() {
      console.log("Form has been submitted");
    },
    getFields: (): Array<Field> => ([
        {
            id: 'given_name',
            helpText: 'First name',
            type: FieldType.TT_TEXT,
            validation: (val: any) => Validation.isName(val)
        },
        {
            id: 'family_name',
            helpText: "Last name",
            type: FieldType.TT_TEXT,
            validation: (val: any) => Validation.isName(val)
        },
        {
            id: 'gender',
            helpText: 'Gender',
            type: FieldType.TT_SELECT,
            requireNext: false,
            validation: (val: any) => Validation.required(val),
            options: () => ([
                { 
                    label: 'Male',
                    value: 'M'
                },
                {
                    label: 'Female',
                    value: 'F'
                }
            ])
        },
        {
            id: 'birth_year',
            helpText: 'Year of birth',
            type: FieldType.TT_NUMBER,
            validation(val: any) {
                const minYr = moment().subtract(100, 'years').year()
                const maxYr = moment().year()
                const noYear = Validation.required(val)
                const notInRange = Validation.rangeOf(val, minYr, maxYr)

                if (val.label.match(/Unknown/i)) return

                return noYear || notInRange
            }
        },
        {
            id: 'birth_month',
            helpText: 'Month of Birth',
            requireNext: false,
            type: FieldType.TT_SELECT,
            options: () => MonthOptions,
            condition: (form: any) => !form.birth_year.value.match(/Unknown/i),
            validation: (val: any,form: any) => {
                const month = val.value
                const year = form.birth_year.value
                const date = `${year}-${month}-01`
                const notValid = moment().isAfter(date) ? null : ['Month is greater than current month']
                const noMonth = Validation.required(val)

                return noMonth || notValid
            }
        },
        {
            id: 'birth_day',
            helpText: 'Birth day',
            type: FieldType.TT_MONTHLY_DAYS,
            condition: (form: any) => form.birth_month != null && !form.birth_month.value.match(/Unknown/i),
            validation: (val: any, form: any) => {
                const day = val.value
                const year = form.birth_year.value
                const month = form.birth_month.value
                const date = `${year}-${month}-${day}`
                const notValid = moment().isAfter(date) ? null : ['Date is greater than current date']
                const noDay = Validation.required(val)

                return noDay || notValid
            }
        },
        {
            id: 'age_estimate',
            helpText: 'Age Estimate',
            type: FieldType.TT_NUMBER,
            condition: (form: any) => form.birth_year.value.match(/Unknown/i),
            validation: (val: any) => Validation.isNumber(val)
        },
        {
            id: 'home_region',
            helpText: 'Region of origin',
            type: FieldType.TT_TEXT
        },
        {
            id: 'home_destrict',
            helpText: 'Home District',
            type: FieldType.TT_TEXT
        },
        {
            id: 'home_ta',
            helpText: 'Home TA',
            type: FieldType.TT_TEXT
        },
        {
            id: 'home_village',
            helpText: 'Home Village',
            type: FieldType.TT_TEXT
        },
        {
            id: 'current_region',
            helpText: 'Current Region',
            type: FieldType.TT_TEXT
        },
        {
            id: 'current_district',
            helpText: 'District',
            type: FieldType.TT_TEXT
        },
        {
            id: 'current_ta',
            helpText: 'Current TA',
            type: FieldType.TT_TEXT
        },
        {
            id: 'current_village',
            helpText: 'Current Village',
            type: FieldType.TT_TEXT
        },
        {
            id: 'landmark',
            helpText: 'Closest Landmark or Plot Number',
            type: FieldType.TT_SELECT,
            options: () => ([
                {
                    label: 'Catholic Church',
                    value: 'Catholic Church,'
                },
                {
                    label: 'CCAP',
                    value: 'CCAP'
                },
                {
                    label: 'Seventh Day',
                    value: 'Seventh Day'
                },
                {
                    label: 'Mosque',
                    value: 'Mosque'
                },
                {
                    label: 'Primary School',
                    value: 'Primary School'
                },
                {
                    label: 'Borehole',
                    value: 'Borehole'
                },
                {
                    label: 'Secondary School',
                    value: 'Secondary School'
                },
                {
                    label: 'College',
                    value: 'College'
                },
                {
                    label: 'Market',
                    value: 'Market'
                },
                {
                    label: 'Football Ground',
                    value: 'Football Ground'
                },
                {
                    label: 'Other',
                    value: 'Other'
                }
            ]),
        },
        {
            id: 'cellphone',
            helpText: 'Cell phone number',
            type: FieldType.TT_NUMBER
        },
        {
            id: 'patient_type',
            helpText: 'Type of patient',
            type: FieldType.TT_SELECT,
            options: () => ([
                {
                    label: 'New patient',
                    value: 'New patient'
                },
                {
                    label: 'External consultation',
                    value: 'External consultation'
                }
            ])
        },
        {
            id: 'location',
            helpText: 'Please select facility name',
            type: FieldType.TT_TEXT
        },
        {
            id: 'occupation',
            helpText: 'Occupation',
            type: FieldType.TT_SELECT,
            options: () => ([
                {
                    label: 'MDF Reserve',
                    value: 'MDF Reserve'
                },
                {
                    label: 'MDF Retired',
                    value: 'MDF Retired'
                },
                {
                    label: 'Civilian',
                    value: 'Civilian'
                }
            ])
        },
        {
            id: 'person_regiment_id',
            helpText: 'Regiment ID',
            type: FieldType.TT_NUMBER
        },
        {
            id: 'person_date_joined_military',
            helpText: 'Date joined MDF',
            type: FieldType.TT_TEXT
        },
        {
            id: 'rank',
            helpText: 'Rank',
            type: FieldType.TT_SELECT,
            options: () => ([
                {
                    label: 'First Lieutenant',
                    value: 'First Lieutenant'
                },
                {
                    label: 'Captain',
                    value: 'Captain'
                },
                {
                    label: 'Major',
                    value: 'Major'
                },
                {
                    label: 'Lieutenant Colonel',
                    value: 'Lieutenant Colonel'
                },
                {
                    label: 'Colonel',
                    value: 'Colonel'
                },
                {
                    label: 'Brigadier General',
                    value: 'Brigadier General'
                },
                {
                    label: 'Lieutenant General',
                    value: 'Lieutenant General'
                },
                {
                    label: 'General',
                    value: 'General'
                },
                {
                    label: 'Private',
                    value: 'Private'
                },
                {
                    label: 'Corporal',
                    value: 'Corporal'
                },
                {
                    label: 'Lance Corporal',
                    value: 'Lance Corporal'
                },
                {
                    label: 'Seargent',
                    value: 'Seargent'
                },
                {
                    label: 'Staff Seargent',
                    value: 'Staff Seargent'
                },
                {
                    label: 'Warrant Officer class 1',
                    value: 'Warrant Officer class 1'
                },
                {
                    label: 'Warrant Officer class 2',
                    value: 'Warrant Officer class 2'
                }
            ])
        },
        {
            id: 'guardian_present',
            helpText: 'Register guardian?',
            type: FieldType.TT_SELECT,
            options: () => ([
                {
                    label: 'Yes',
                    value: 'Yes'
                },
                {
                    label: 'No',
                    value: 'No'
                }
            ])
        }
    ])
  },
})
</script>