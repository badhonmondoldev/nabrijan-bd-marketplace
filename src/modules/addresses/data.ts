export interface BangladeshDivision {
  name: string;
  districts: {
    name: string;
    upazilas: string[];
  }[];
}

export const BANGLADESH_ADMINISTRATIVE_DATA: BangladeshDivision[] = [
  {
    name: 'Dhaka',
    districts: [
      {
        name: 'Dhaka',
        upazilas: ['Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur', 'Mohammadpur', 'Badda', 'Tejgaon', 'Savara', 'Keraniganj'],
      },
      {
        name: 'Gazipur',
        upazilas: ['Gazipur Sadar', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj'],
      },
      {
        name: 'Narayanganj',
        upazilas: ['Narayanganj Sadar', 'Araihazar', 'Bandar', 'Rupganj', 'Sonargaon'],
      },
    ],
  },
  {
    name: 'Chittagong',
    districts: [
      {
        name: 'Chittagong',
        upazilas: ['Agrabad', 'Halishahar', 'Panchlaish', 'Kotwali', 'Hathazari', 'Sitakunda', 'Patiya'],
      },
      {
        name: 'Cox\'s Bazar',
        upazilas: ['Cox\'s Bazar Sadar', 'Teknaf', 'Ukhiya', 'Chakaria', 'Ramu'],
      },
    ],
  },
  {
    name: 'Sylhet',
    districts: [
      {
        name: 'Sylhet',
        upazilas: ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Sreemangal', 'Molevibazar'],
      },
    ],
  },
  {
    name: 'Rajshahi',
    districts: [
      {
        name: 'Rajshahi',
        upazilas: ['Boalia', 'Rajpara', 'Puthia', 'Godagari', 'Tanore'],
      },
    ],
  },
  {
    name: 'Khulna',
    districts: [
      {
        name: 'Khulna',
        upazilas: ['Khulna Sadar', 'Sonadanga', 'Daulatpur', 'Rupsha', 'Batiaghata'],
      },
    ],
  },
  {
    name: 'Barisal',
    districts: [
      {
        name: 'Barisal',
        upazilas: ['Barisal Sadar', 'Babuganj', 'Gournadi', 'Agailjhara', 'Wazirpur'],
      },
    ],
  },
  {
    name: 'Rangpur',
    districts: [
      {
        name: 'Rangpur',
        upazilas: ['Rangpur Sadar', 'Badarganj', 'Pirganj', 'Mithapukur', 'Kaunia'],
      },
    ],
  },
  {
    name: 'Mymensingh',
    districts: [
      {
        name: 'Mymensingh',
        upazilas: ['Mymensingh Sadar', 'Muktagachha', 'Trishal', 'Bhaluka', 'Gafargaon'],
      },
    ],
  },
];
