import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@pheralb/toast";
import { BASE_URL } from "../utils/contstants";

export const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();

	const validateEmail = (value) => {
		const trimmed = value.trim();
		if (!trimmed) return "Email is required";
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!re.test(trimmed)) return "Please enter a valid email address";
		return "";
	};

	const validatePassword = (value) => {
		if (!value) return "New password is required";
		if (value.length < 8)
			return "Password must be at least 8 characters long";
		return "";
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const emailError = validateEmail(email);
		const passwordError = validatePassword(newPassword);

		const nextErrors = {};
		if (emailError) nextErrors.email = emailError;
		if (passwordError) nextErrors.newPassword = passwordError;
		setErrors(nextErrors);

		if (Object.keys(nextErrors).length > 0) return;

		setIsSubmitting(true);
		try {
			await axios.post(
				`${BASE_URL}/profile/password`,
				{
					emailId: email.trim(),
					newPassword,
				},
				{ withCredentials: true },
			);

			towardsSuccess();
		} catch (error) {
			const message =
				error.response?.data?.message ||
				error.response?.data ||
				error.message ||
				"Could not reset password. Please try again.";
			toast.error({
				text: "Password reset failed",
				description: message,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const towardsSuccess = () => {
		toast.success({
			text: "Password reset successful",
			description: "You can now log in with your new password.",
		});
		navigate("/login");
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<div className="card bg-base-100 shadow-xl border border-base-300/60 rounded-2xl">
					<div className="card-body p-8 sm:p-10">
						<div className="text-center mb-8">
							<h1 className="font-logo text-3xl font-bold text-base-content tracking-tight">
								Reset password
							</h1>
							<p className="mt-2 text-base-content/70 text-sm">
								Enter your email and new password to reset your account.
							</p>
						</div>

						<form onSubmit={handleSubmit} className="space-y-5">
							<div className="form-control">
								<label htmlFor="email" className="label">
									<span className="label-text font-semibold">Email</span>
								</label>
								<input
									id="email"
									type="email"
									className={`input input-bordered w-full rounded-xl ${
										errors.email ? "input-error" : ""
									}`}
									placeholder="you@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								{errors.email && (
									<p className="label-text-alt text-error mt-1">
										{errors.email}
									</p>
								)}
							</div>

							<div className="form-control">
								<label htmlFor="newPassword" className="label">
									<span className="label-text font-semibold">
										New password
									</span>
									<span className="label-text-alt">
										min 8 characters
									</span>
								</label>
								<input
									id="newPassword"
									type="password"
									className={`input input-bordered w-full rounded-xl ${
										errors.newPassword ? "input-error" : ""
									}`}
									placeholder="••••••••"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>
								{errors.newPassword && (
									<p className="label-text-alt text-error mt-1">
										{errors.newPassword}
									</p>
								)}
							</div>

							<button
								type="submit"
								className="btn btn-primary w-full rounded-xl h-12 text-base font-semibold shadow-lg shadow-primary/20 disabled:opacity-50"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<span className="loading loading-spinner loading-sm" />
										Resetting…
									</>
								) : (
									"Reset password"
								)}
							</button>
						</form>

						<button
							type="button"
							className="btn btn-ghost btn-sm mt-4 w-full rounded-xl"
							onClick={() => navigate("/login")}
						>
							Back to login
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

