import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from "../../../../generated/prisma";

type UserFormProps = {
    user: Users;
    onChange: (user: Users) => void;
    onSubmit: () => void;
    submitLabel: string;
    mode: "add" | "edit"; // 👈 add mode
};

export default function UserForm({ user, onChange, onSubmit, submitLabel, mode }: UserFormProps) {
    return (
        <div className="space-y-4">
            <label>Username</label>
            <Input
                placeholder="Username"
                autoComplete="new-username"
                value={user.name}
                onChange={(e) => onChange({ ...user, name: e.target.value })}
            />

            <label>Email</label>
            <Input
                placeholder="Email"
                autoComplete="new-email"
                value={user.email}
                onChange={(e) => onChange({ ...user, email: e.target.value })}
            />

            <label>Role</label>
            <Input
                placeholder="Role"
                value={user.role}
                onChange={(e) => onChange({ ...user, role: e.target.value })}
            />

            <label>Password</label>
            <Input
                type="password"
                autoComplete="new-password"
                placeholder={mode === "edit" ? "Leave blank to keep current password" : "Password"}
                value={user.password}
                onChange={(e) => onChange({ ...user, password: e.target.value })}
            />

            <Button 
                onClick={onSubmit} 
                disabled={
                    !user.name.trim() ||          // name empty
                    !user.email.trim() ||         // email empty
                    !user.role.trim() ||          // role empty
                    (mode === "add" && !user.password.trim()) // password empty for add
                }
            >
                {submitLabel}
            </Button>
        </div>
    );
}
