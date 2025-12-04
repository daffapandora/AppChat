export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  UserList: undefined;
  Profile: undefined;
  Chat: {
    userId: string;
    userEmail: string;
    displayName?: string;
  };
};
