import { ProfileForm } from "@/components/settings/profile-form";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and energy preferences.
        </p>
      </div>

      <ProfileForm />
    </div>
  );
}
