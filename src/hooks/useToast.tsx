/* eslint-disable @typescript-eslint/no-explicit-any */
import {toast} from "sonner";

const UseToast = (promise: any, loadingMessage: string, onSuccess?:Function) => {
    toast.promise(
        // eslint-disable-next-line no-async-promise-executor
        new Promise(async (resolve, reject) => {
            try {
                const result = await promise;

                if (result?.data?.success === true) {
                    resolve(result?.data?.message);
                    onSuccess && onSuccess(result.data)
                } else {
                    reject(
                        new Error(
                            result?.error?.data?.message ||
                            "Something went wrong please try again"
                        )
                    );
                }
            } catch (error) {
                reject(error);
            }
        }),
        {
            loading: loadingMessage || "Loading...",
            success: (message: any) => {
                return message;
            },
            error: (error) => {
                return error.message;
            },
        },
       
    );

    return promise; 
};

export default UseToast;