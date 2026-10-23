import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { buttonClasses } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className={buttonClasses("outline", "min-h-10 px-4")}>
        <LogOut className="size-4" aria-hidden="true" />
        Cerrar sesión
      </button>
    </form>
  );
}
