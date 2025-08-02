import { useAppDispatch, useAppSelector } from "../store/app/hooks";
import { useLoginMutation } from "../store/services/authApiSlice";
import UseToast from "./useToast";
import { addUser, logout } from "../store/features/userSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRegisterMutation } from "../store/services/userApiSlice";

export interface UserData {
    fullname: string;
    firstName: string;
    lastName: string;
    phone: string;
    phoneNumberVerified: boolean;
    email: string;
    emailVerified: boolean;
    profileImage: string;
    gender: string;
    dob: string;
    role: string;
    status: string;
    _id: string;
    __v: number;
}

interface UserResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        user: UserData;
    };
}
interface UserState {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: UserData;
    };
}
interface RegisterPayload extends Partial<UserData> {
    password: string;
}

export const useAuth = () => {
    const dispatch = useAppDispatch();

    // Select the current user from state
    const user: UserState | null = useAppSelector(
        (state) => state.local.userReducer.userInfo
    ) as UserState | null;


    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // // Mutations
    // const [login, {data:loginData,isError:loginError}] = useLoginMutation();
    // const [register,{data:registerData, isError: registerError}] = useRegisterMutation();
    const [login] = useLoginMutation();
    const [register] = useRegisterMutation();

    // Logout handler
    const handleLogout = () => {
        dispatch(logout());
    };

    // Utility function to handle redirects
    const redirectAfterSuccess = () => {
        const redirectPath = searchParams.get("redirect") || "/";
        navigate(redirectPath);
    };

    // Login handler fake
    const handleLogin = (email: string, password: string, onSuccess:()=>void) => {
        dispatch(addUser({
            success: true,
            data: {
                accessToken: "fake",
                user:{
                    fullname: 'fake',
                },
            message: "user is fetched fake"
            }
        }));
        redirectAfterSuccess();


        UseToast(
            login({ email, password }),
            "Logging in...",
            (result:UserResponse) => {  
                dispatch(addUser(result));
                onSuccess()
                redirectAfterSuccess();
            }
        );
    };

    // Register handler
    const handleRegister = (payload:RegisterPayload,onSuccess:()=>void) => {
        UseToast(
            register(payload),
            "Creating account...",
            (result: UserResponse) => {    
                dispatch(addUser(result));
                onSuccess()
                redirectAfterSuccess();
            }
        );
    };

    //Sync login data to Redux store
    // useEffect(() => {
    //     console.log(loginData,loginError,'out')
    //     if (loginData && !loginError  ) {
    //         console.log(loginData,'in')
    //         dispatch(addUser(loginData));
    //     }
    // }, [loginData]);

    // Sync registration data to Redux store
    // useEffect(() => {
    //     if (registerData && !registerError) {
    //         dispatch(addUser(registerData));
    //     }
    // }, [registerData]);

    return {
        user,
        authActions: {
            login: handleLogin,
            register: handleRegister,
            logout: handleLogout,
        },
        redirectAfterSuccess
    };
};