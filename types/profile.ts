export interface Profile {
  id: string;
  user_id: string;
  name: string;
  address: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  birthday: string;
  blood_type: string;
  height: number;
  weight: number;
  allergy?: string | null;
  medical_history?: string | null;
  biography?: string | null;
  extra_data: {
    hobbies: string[];
    occupation: string;
  };
  User: {
    id: string;
    phone: string;
    email: string;
    avatar_url: string;
    email_verified: boolean;
    phone_verified: boolean;
  };
}
