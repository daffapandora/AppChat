export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  UserList: undefined;
  Chat: {
    userId: string;
    userEmail: string;
    displayName?: string;
  };
};
