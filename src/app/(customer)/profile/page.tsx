"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Badge } from "@/components/ui";
import { LogOut, Mail, Phone, User } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  if (!session) return null;
  const user = session.user as {
    id: string;
    name: string;
    email: string;
    role?: string;
    status?: string;
    phone?: string;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-3xl font-bold text-primary-700">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">{user.name}</h2>
            <div className="flex gap-2 mt-1">
              <Badge label={user.role || "customer"} variant={user.role || "customer"} />
              <Badge label={user.status || "active"} variant={user.status || "active"} />
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail size={16} className="text-gray-400" />
            {user.email}
          </div>
          {user.phone && (
            <div className="flex items-center gap-3 text-gray-700">
              <Phone size={16} className="text-gray-400" />
              {user.phone}
            </div>
          )}
          <div className="flex items-center gap-3 text-gray-700">
            <User size={16} className="text-gray-400" />
            Member ID: {user.id.slice(0, 12)}...
          </div>
        </div>

        <div className="border-t border-gray-100 mt-6 pt-4">
          <button
            onClick={handleSignOut}
            className="btn-danger w-full flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
