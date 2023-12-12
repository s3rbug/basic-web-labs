type Props = {
	message?: string;
};

export function ErrorMessage({ message }: Props) {
	if (!message) return null;
	return <div className="text-red-600 text-sm">{message}</div>;
}
