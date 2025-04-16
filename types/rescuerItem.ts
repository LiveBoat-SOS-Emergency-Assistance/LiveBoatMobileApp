export interface RescuerItem {
  id: string;
  sos_id: string;
  user_id: string;
  longitude: string;
  latitude: string;
  accuracy: string;
  location_updated_at: string;
  status: string;
  accepted_at: string;
  User: {
    id: string;
    phone: string;
    email: string;
    status: number;
    email_verified: boolean;
    phone_verified: boolean;
    avatar_url: string | null;
    refresh_token: string;
    UserProfile: {
      id: string;
      user_id: string;
      name: string;
      address: string | null;
      gender: string | null;
      birthday: string | null;
      blood_type: string | null;
      height: number | null;
      weight: number | null;
      allergy: string | null;
      medical_history: string | null;
      biography: string | null;
      extra_data: any;
    };
  };
}
