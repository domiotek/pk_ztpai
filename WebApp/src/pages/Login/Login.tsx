import classes from "../Portal/Common.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useCallback, useEffect, useId } from "react";
import { callAPI, processFormData } from "../../modules/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { RESTAPI } from "../../types/api";

export default function Login() {

    const emailInputID = useId();
    const passwordInputID = useId();

    const {isSuccess} = useQuery({
        queryKey: ["UserData"],
        queryFn: ()=>callAPI<RESTAPI.UserData.IEndpoint>("GET","/api/me"),
        retry: false
    });

    const navigate = useNavigate();

    const signInMutation = useMutation<RESTAPI.SignIn.IResponseData,RESTAPI.SignIn.IEndpoint["error"], RESTAPI.SignIn.IRequest>({
        mutationFn: formData=>callAPI<RESTAPI.SignIn.IEndpoint>("POST","/api/auth/signin",formData, null, true),
        onSuccess: data=>{
            localStorage.setItem("token",data.token);
            navigate("/");
        }
    });

    const onSubmit = useCallback((e: FormEvent)=>{
        e.preventDefault();
        const formData = processFormData(e.target as HTMLFormElement) as RESTAPI.SignIn.IRequest;

        signInMutation.mutate(formData);
    },[]);

    useEffect(()=>{
        if(isSuccess) {
            navigate("/");
        }
    },[isSuccess]);

	return (
		<form className={classes.Wrapper} onSubmit={onSubmit}>
            {
                signInMutation.isError &&
                <p className={classes.ErrorBox}>
                    {signInMutation.error.code=="BadCredentials"?
                        "Invalid credentials. Try again."
                        :
                        "Unexpected error prevented you from logging in."
                    }
                </p>
            }
            <label htmlFor={emailInputID}>Email</label>
            <input id={emailInputID} name="username" type="email" required />

            <label htmlFor={passwordInputID}>Password</label>
            <input id={passwordInputID} name="password" type="password" required />
            <button type="submit" disabled={signInMutation.isPending}>Login</button>

            <h5>Don't have an account yet? <Link to="/register">Register now</Link></h5>
        </form>
	)
}
