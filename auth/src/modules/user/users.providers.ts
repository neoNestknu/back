import {Users} from "./entity/users.entity";
import {USERS_REPOSITORY} from "../../constants/constants";

export const UsersProviders = [
  {
    provide: USERS_REPOSITORY,
    useValue: Users,
  },
];
