import {AnimationObject} from 'lottie-react-native';

export interface OnboardingData {
  id: number;
  animation?: AnimationObject;
  image?: any; // require/import for PNG or GIF
  text: string;
  textColor: string;
  backgroundColor: string;
  widthRatio?: number;
  heightRatio?: number;
  fontSize?: number;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require('../assets/animations/lifebuoy.json'),
    text: 'Chào mừng bạn đến với Liveboat',
    textColor: '#005b4f',
    backgroundColor: '#ffa3ce',
    widthRatio: 1,
    heightRatio: 1,
    fontSize: 46,
  },
  {
    id: 2,
    animation: require('../assets/animations/tutorial.json'),
    text: 'Hãy lướt qua phải để xem giới thiệu về app',
    textColor: '#1e2169',
    backgroundColor: '#bae4fd',
    fontSize: 46,
  },
  {
    id: 3,
    image: require('../assets/images/main-screen.png'),
    text: 'Liveboat là app hỗ trợ kết nối người gặp nạn, với những người xung quanh',
    textColor: '#F15937',
    backgroundColor: '#faeb8a',
    widthRatio: 1.2,
    heightRatio: 1.2,
    fontSize: 26,
  },
  {
    id: 4,
    image: require('../assets/images/sos-sendsos.png'),
    text: 'App cần quyền truy cập vào Định Vị',
    textColor: '#F15937',
    backgroundColor: '#FFE0B2',
    widthRatio: 2,
    heightRatio: 1,
  },
  {
    id: 5,
    animation: require('../assets/animations/lottie1.json'),
    text: 'Kết nối với đội cứu hộ gần nhất',
    textColor: '#2E7D32',
    backgroundColor: '#C8E6C9',
    widthRatio: 1,
    heightRatio: 1,
    fontSize: 42,
  },
  {
    id: 6,
    image: require('../assets/images/ava1.png'),
    text: 'Chat với AI để được hỗ trợ 24/7',
    textColor: '#1565C0',
    backgroundColor: '#F3E5F5',
    widthRatio: 0.9,
    heightRatio: 0.9,
    fontSize: 40,
  },
  {
    id: 7,
    animation: require('../assets/animations/lottie2.json'),
    text: 'Sẵn sàng bắt đầu hành trình an toàn!',
    textColor: '#D84315',
    backgroundColor: '#FFCCBC',
    widthRatio: 1.1,
    heightRatio: 1.1,
    fontSize: 44,
  },
];

export default data;
