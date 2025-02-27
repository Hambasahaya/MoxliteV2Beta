export type iValueProposition = {
  value: string;
  description: string;
  id: number;
};

export type iAboutAttribute = {
  totalInstalledFixtures: number;
  totalCitiesInIndonesia: number;
  totalClients: number;
  content: string;
  valueProposition: iValueProposition[];
  customers: {
    name: string;
    imgUrl: string;
  }[];
};
export type iAboutProps = {
  data: iAboutAttribute | null;
};
