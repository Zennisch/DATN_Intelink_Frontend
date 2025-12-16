export const Logo = () => {
	return (
		<div className="flex items-center justify-start px-4">
			<a href="/" className="flex flex-row justify-start items-center gap-2">
				<img
					src="/assets/logo.png"
					alt="Intelink Logo"
					className="h-8 w-8 mb-2"
				/>
				<h2 className="text-black text-2xl font-semibold">Intelink</h2>
			</a>
		</div>
	);
};
