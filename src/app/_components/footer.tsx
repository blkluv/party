import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from "~/config/constants";
import { Button } from "./ui/button";

export const Footer = () => {
  return (
    <div className="w-full border-t border-neutral-800 px-2 py-8 flex justify-center items-center gap-8 bg-neutral-900">
      <a target="_blank" href={TERMS_OF_SERVICE_URL}>
        <Button variant="ghost">Terms of Service</Button>
      </a>
      <a target="_blank" href={PRIVACY_POLICY_URL}>
        <Button variant="ghost">Privacy Policy</Button>
      </a>
    </div>
  );
};
