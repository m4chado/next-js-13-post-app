import Link from "next/link";
import Login from "../auth/Login";
import Logged from "../auth/Logged";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function Nav() {
	const session = await getServerSession(authOptions);
	return (
		<nav className="flex justify-between items-center py-8 ">
			<Link href={"/"}>
				<h1 className="font-bold text-4xl text-gray-700 dark:text-white">NextPost.</h1>
			</Link>
			<div className="flex items-center gap-6">
				{!session?.user && <Login />}
				{session?.user && <Logged image={session.user?.image || ""} />}
			</div>
		</nav>
	);
}
