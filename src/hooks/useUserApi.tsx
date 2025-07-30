import {
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../store/services/userApiSlice";
import { UserData } from "./useAuth";
import UseToast from "./useToast";

export const useUserApi = () => {
  const [update] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  
  const updateUser = (payload: Partial<UserData>, onSuccess: () => void) => {
    UseToast(update(payload), "Updating...", () => {
      onSuccess();
    });
  };
  const deleteUser2 = (id: string) => {
    UseToast(deleteUser(id), "Deleting...", () => {});
  };



  return {
    updateUser,
    deleteUser: deleteUser2,
  };
};
 