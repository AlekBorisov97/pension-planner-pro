import { NationalMortalityData } from "@/utils/calculatorUtils";

export const retirementAgesByYear = [
  {
    year: 2016,
    female: { years: 60, months: 10 },
    male: { years: 63, months: 10 },
  },
  {
    year: 2017,
    female: { years: 61, months: 0 },
    male: { years: 64, months: 0 },
  },
  {
    year: 2018,
    female: { years: 61, months: 2 },
    male: { years: 64, months: 1 },
  },
  {
    year: 2019,
    female: { years: 61, months: 4 },
    male: { years: 64, months: 2 },
  },
  {
    year: 2020,
    female: { years: 61, months: 6 },
    male: { years: 64, months: 3 },
  },
  {
    year: 2021,
    female: { years: 61, months: 8 },
    male: { years: 64, months: 4 },
  },
  {
    year: 2022,
    female: { years: 61, months: 10 },
    male: { years: 64, months: 5 },
  },
  {
    year: 2023,
    female: { years: 62, months: 0 },
    male: { years: 64, months: 6 },
  },
  {
    year: 2024,
    female: { years: 62, months: 2 },
    male: { years: 64, months: 7 },
  },
  {
    year: 2025,
    female: { years: 62, months: 4 },
    male: { years: 64, months: 8 },
  },
  {
    year: 2026,
    female: { years: 62, months: 6 },
    male: { years: 64, months: 9 },
  },
  {
    year: 2027,
    female: { years: 62, months: 8 },
    male: { years: 64, months: 10 },
  },
  {
    year: 2028,
    female: { years: 62, months: 10 },
    male: { years: 64, months: 11 },
  },
  {
    year: 2029,
    female: { years: 63, months: 0 },
    male: { years: 65, months: 0 },
  },
  {
    year: 2030,
    female: { years: 63, months: 3 },
    male: { years: 65, months: 0 },
  },
  {
    year: 2031,
    female: { years: 63, months: 6 },
    male: { years: 65, months: 0 },
  },
  {
    year: 2032,
    female: { years: 63, months: 9 },
    male: { years: 65, months: 0 },
  },
  {
    year: 2033,
    female: { years: 64, months: 0 },
    male: { years: 65, months: 0 },
  },
  {
    year: 2034,
    female: { years: 64, months: 3 },
    male: { years: 65, months: 0 },
  },
  {
    year: 2035,
    female: { years: 64, months: 6 },
    male: { years: 65, months: 0 },
  },
  {
    year: 2036,
    female: { years: 64, months: 9 },
    male: { years: 65, months: 0 },
  },
  {
    year: 2037,
    female: { years: 65, months: 0 },
    male: { years: 65, months: 0 },
  },
];

export const workExperienceRequirementsByYear = [
  { year: 2016, female: 35.17, male: 38.17 },
  { year: 2017, female: 35.33, male: 38.33 },
  { year: 2018, female: 35.5, male: 38.5 },
  { year: 2019, female: 35.67, male: 38.67 },
  { year: 2020, female: 35.83, male: 38.83 },
  { year: 2021, female: 36.0, male: 39.0 },
  { year: 2022, female: 36.17, male: 39.17 },
  { year: 2023, female: 36.33, male: 39.33 },
  { year: 2024, female: 36.5, male: 39.5 },
  { year: 2025, female: 36.67, male: 39.67 },
  { year: 2026, female: 36.83, male: 39.83 },
  { year: 2027, female: 37.0, male: 40.0 },
  // ... the rest all have 37.00/40.00 up to 2065
];

const mortalityData: NationalMortalityData[] = [
  {
    age: 0,
    qx: {
      total: 0.009418876922464995,
      male: 0.010466671045311677,
      female: 0.008326516224240053,
    },
    px: {
      total: 0.990581123077535,
      male: 0.9895333289546884,
      female: 0.9916734837757599,
    },
    ex: {
      total: 73.58126532621033,
      male: 69.99769242368068,
      female: 77.241825024242,
    },
  },
  {
    age: 1,
    qx: {
      total: 0.0008385198399395259,
      male: 0.0008631302586123745,
      female: 0.0008105270753807367,
    },
    px: {
      total: 0.9991614801600605,
      male: 0.9991368697413876,
      female: 0.9991894729246192,
    },
    ex: {
      total: 73.27904501736806,
      male: 69.7359678711931,
      female: 76.88868329499357,
    },
  },
  {
    age: 2,
    qx: {
      total: 0.0003574416220255063,
      male: 0.00027552603775282886,
      female: 0.00044310028473910207,
    },
    px: {
      total: 0.9996425583779744,
      male: 0.9997244739622472,
      female: 0.9995568997152608,
    },
    ex: {
      total: 72.34040117442785,
      male: 68.79534721702785,
      female: 75.95024302334573,
    },
  },
  {
    age: 3,
    qx: {
      total: 0.0003680132830746291,
      male: 0.0004691743723771511,
      female: 0.00026244770760116756,
    },
    px: {
      total: 0.9996319867169253,
      male: 0.9995308256276229,
      female: 0.9997375522923988,
    },
    ex: {
      total: 71.36620766838243,
      male: 67.81403174849956,
      female: 74.9834682194645,
    },
  },
  {
    age: 4,
    qx: {
      total: 0.0002550610546035187,
      male: 0.00032548138434964035,
      female: 0.00018065257713793448,
    },
    px: {
      total: 0.9997449389453965,
      male: 0.9996745186156504,
      female: 0.999819347422862,
    },
    ex: {
      total: 70.39241904571757,
      male: 66.84539389422619,
      female: 74.00289010832928,
    },
  },
  {
    age: 5,
    qx: {
      total: 0.0003462316650497167,
      male: 0.0004914211900817163,
      female: 0.0001928397131138422,
    },
    px: {
      total: 0.9996537683349502,
      male: 0.9995085788099183,
      female: 0.9998071602868862,
    },
    ex: {
      total: 69.41033502237207,
      male: 65.86683232199307,
      female: 73.0160806514715,
    },
  },
  {
    age: 6,
    qx: {
      total: 0.0002960583531013963,
      male: 0.0003448350179960775,
      female: 0.000244237520989162,
    },
    px: {
      total: 0.9997039416468986,
      male: 0.9996551649820039,
      female: 0.9997557624790109,
    },
    ex: {
      total: 68.43420052416005,
      male: 64.89896996671916,
      female: 72.0300646822868,
    },
  },
  {
    age: 7,
    qx: {
      total: 0.0002545024477147177,
      male: 0.00029004843808916087,
      female: 0.0002165841584158416,
    },
    px: {
      total: 0.9997454975522853,
      male: 0.9997099515619109,
      female: 0.9997834158415841,
    },
    ex: {
      total: 67.45432279924088,
      male: 63.921193054751555,
      female: 71.04753829007362,
    },
  },
  {
    age: 8,
    qx: {
      total: 0.00020943034944949737,
      male: 0.0002470230094667936,
      female: 0.00016955291977834808,
    },
    px: {
      total: 0.9997905696505505,
      male: 0.9997529769905332,
      female: 0.9998304470802216,
    },
    ex: {
      total: 66.47137079240858,
      male: 62.939597694417884,
      female: 70.06282419584211,
    },
  },
  {
    age: 9,
    qx: {
      total: 0.0002912001553067495,
      male: 0.00034933480830252395,
      female: 0.00022996788115259902,
    },
    px: {
      total: 0.9997087998446933,
      male: 0.9996506651916974,
      female: 0.9997700321188474,
    },
    ex: {
      total: 65.48518856967864,
      male: 61.95502305900673,
      female: 69.07462022176767,
    },
  },
  {
    age: 10,
    qx: {
      total: 0.00019811938979227945,
      male: 0.00019340345448324084,
      female: 0.00020307105924988674,
    },
    px: {
      total: 0.9998018806102077,
      male: 0.9998065965455167,
      female: 0.9997969289407501,
    },
    ex: {
      total: 64.5041182545317,
      male: 60.976501180268016,
      female: 68.09039241553361,
    },
  },
];
