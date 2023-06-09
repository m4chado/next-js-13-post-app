"use client";

import { useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function CreatePost() {
	const [title, setTitle] = useState("");
	const [isDisabled, setIsDisbled] = useState(false);
	const queryClient = useQueryClient();
	let toastPostId: string;

	const { mutate } = useMutation(
		async (title: string) => await axios.post("/api/posts/addPost", { title }),
		{
			onError: (error) => {
				if (error instanceof AxiosError) {
					toast.dismiss();
					toast.error(error?.response?.data.message, { id: toastPostId });
				}
				setIsDisbled(false);
			},
			onSuccess: (data) => {
				toast.dismiss();
				toast.success("Post has been made!", { id: toastPostId });
				queryClient.invalidateQueries(["posts"]);
				setTitle("");
				setIsDisbled(false);
			},
		}
	);

	const submitPost = async (e: React.FormEvent) => {
		e.preventDefault();
		toastPostId = toast.loading("Creating your post");
		setIsDisbled(true);
		mutate(title);
	};

	return (
		<form onSubmit={submitPost} className="bg-white dark:bg-slate-700 my-8 p-8 rounded-md">
			<div className="flex flex-col my-4">
				<textarea
					onChange={(e) => setTitle(e.target.value)}
					name="title"
					value={title}
					placeholder="What's on your mind?"
					className="p-4 text-lg rounded-lg my-2 bg-gray-200 dark:bg-gray-500"
				></textarea>
			</div>
			<div className="flex items-center justify-between gap-2">
				<p
					className={`font-bold text-sm ${
						title.length > 300 ? "text-red-700" : "text-gray-700 dark:text-white"
					}`}
				>{`${title.length}/300`}</p>
				<button
					disabled={isDisabled}
					className="text-sm bg-teal-600 text-white py-2 px-6 rounded-md disabled:opacity-25"
					type="submit"
				>
					Create a post
				</button>
			</div>
		</form>
	);
}
