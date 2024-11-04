import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
	const formik = useFormik({
		initialValues: { email: "", name: "" },
		validationSchema: Yup.object({
			name: Yup.string()
				.max(20, "Name should be less than 20charss")
				.required("Required"),
			email: Yup.string().email("Not a valid emaill").required("Requ"),
		}),
		onSubmit: (val) => {
			alert("button clicked " + JSON.stringify(val, null, 2));
		},
	});
	return (
		<>
			<h1>Login</h1>
			<form onSubmit={formik.handleSubmit}>
				<label htmlFor="email">email</label>
				<input
					name="email"
					id="email"
					type="email"
					{...formik.getFieldProps("email")}
				/>
				{formik.touched.email && formik.errors.email ? (
					<div>{formik.errors.email}</div>
				) : null}
				<label htmlFor="name">name</label>
				<input
					name="name"
					id="name"
					type="name"
					{...formik.getFieldProps("name")}
				/>
				{formik.touched.name && formik.errors.name ? (
					<div>{formik.errors.name}</div>
				) : null}
				<button type="submit">submit</button>
			</form>
		</>
	);
};

export default Login;
