import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex-1 justify-center flex items-center p-2">
      <SignIn />
    </div>
  );
}
