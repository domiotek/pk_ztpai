import { Link, useNavigate } from "react-router-dom";
import classes from "../Portal/Common.module.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { callAPI, processFormData } from "../../modules/utils";
import { RESTAPI } from "../../types/api";
import { FormEvent, useCallback, useEffect, useId } from "react";

export default function Register() {

    const emailInputID = useId();
    const nameInputID = useId();
    const passwordInputID = useId();
    const cpasswordInputID = useId();

    const {isSuccess} = useQuery({
        queryKey: ["UserData"],
        queryFn: ()=>callAPI<RESTAPI.UserData.IEndpoint>("GET","/api/me"),
        retry: false
    });

    const navigate = useNavigate();

    useEffect(()=>{
        if(isSuccess) {
            navigate("/");
        }
    },[isSuccess]);


    const signUpMutation = useMutation<null,RESTAPI.SignUp.IEndpoint["error"], RESTAPI.SignUp.IRequest>({
        mutationFn: formData=>callAPI<RESTAPI.SignUp.IEndpoint>("POST","/api/auth/signup",formData, null, true),
        onSuccess: ()=>navigate("/login")
    });

    const onSubmit = useCallback((e: FormEvent)=>{
        e.preventDefault();
        const formData = processFormData(e.target as HTMLFormElement) as RESTAPI.SignUp.IRequest;

        signUpMutation.mutate(formData);
    },[]);

	return (
		<form className={classes.Wrapper} onSubmit={onSubmit}>
            {
                signUpMutation.isError &&
                <p className={classes.ErrorBox}>
                    {signUpMutation.error.code=="BadRequest"?
                        signUpMutation.error.message
                        :
                        "Unexpected error prevented you from logging in."
                    }
                </p>
            }
            <label htmlFor={emailInputID}>Email</label>
            <input id={emailInputID} name="username" type="email" autoComplete="username" required/>

            <label htmlFor={nameInputID}>Name</label>
            <input id={nameInputID} name="name" type="text" required />

            <label htmlFor={passwordInputID}>Password</label>
            <input id={passwordInputID} name="password" type="password" autoComplete="new-password" required />
            
            <label htmlFor={cpasswordInputID}>Confirm Password</label>
            <input id={cpasswordInputID} type="password" name = "cpassword" autoComplete="new-password" required />

            <button type="submit" disabled={signUpMutation.isPending}>Register</button>

            <h5>Already have an account? <Link to="/login">Login now</Link></h5>
        </form>
	)
}
