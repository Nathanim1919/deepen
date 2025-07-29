import  { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiRefreshCw,
  // FiUpload,
  // FiStar,
} from "react-icons/fi";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { SetApiKeyModal } from "../components/modals/setApiKey.modal";
import { ResetDataModal } from "../components/modals/reseData.modal";
import { ActionButton } from "../components/modals/actionButton";
import { UpgradeModal } from "../components/modals/upgrade.modal";
import { DeleteAccountModal } from "../components/modals/accountDelete.model";
import { ExportDataModal } from "../components/modals/exportData.modal";
import { getUserProfileInfo, type IUserProfile } from "../api/account.api";
import { authClient } from "../lib/auth-client";
import type { User } from "better-auth/types";
import { useNavigate } from "@tanstack/react-router";
import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";

export const UserProfile = () => {
  const [activeModal, setActiveModal] = useState<
    null | "export" | "apiKey" | "upgrade" | "delete" | "reset"
  >(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const closeModal = () => setActiveModal(null);
  const [userProfileData, setUserProfileData] = useState<IUserProfile>();
  const [authInfo, setAuthInfo] = useState<User>();
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function getUserProfile() {
      const auth = await authClient.getSession();
      setAuthInfo(auth?.data?.user);
      const data = await getUserProfileInfo();
      setUserProfileData(data);
      setHasApiKey(data.externalServices.gemini.hasApiKey);
    }
    getUserProfile();
  }, []);


    const handleLogOut = async () => {
    setLoading(true);
    await authClient
      .signOut({
        fetchOptions: {
          onSuccess: () => {
            navigate({ to: "/login" });
          },
        },
      })
      .then(() => {
        toast.success("Logged out successfully");
      })
      .catch(() => {
        toast.error("Error occured when logging out");
      });
    setLoading(false);
  };


  return (
    <div className="min-h-screen grid gap-2 place-items-start bg-[#f5f2f2] dark:bg-[#000000] text-black dark:text-[#f5f5f7]">
      <div className="max-w-3xl mx-auto mt-6 grid gap-4 w-full px-4">
        {/* Profile Header */}
    <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="w-full rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6  flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 flex items-center justify-center text-white text-2xl font-bold">
              {authInfo?.image ? (
                <img
                  src={authInfo.image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                authInfo?.name?.[0].toUpperCase()
              )}
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-black"></div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold ">{authInfo?.name}</h2>
              <p className="text-sm text-gray-400">
                Joined {authInfo?.createdAt ? new Date(authInfo.createdAt).toLocaleDateString() : "Unknown"}
              </p>
            </div>
          </div>
          <button onClick={handleLogOut} className="text-sm cursor-pointer text-blue-400 hover:underline transition">
              {
                loading?
                <span className="flex items-center gap-2">
                  <VscLoading className="animate-spin duration-150"/>
                  Logging out...
                </span>:
                "LogOut"

              }
          </button>
        </motion.div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <ActionButton
            icon={<FiUpload className="text-xl text-blue-400" />}
            title="Export Data"
            description="Download all your data in JSON format"
            onClick={() => setActiveModal("export")}
            color="bg-[#2c2c2e]"
            borderColor="border-[#3a3a3c]"
          /> */}

          <ActionButton
            icon={<RiShieldKeyholeLine className="text-xl text-blue-400" />}
            title="Gemini API Key"
            description="Add or update your API key"
            onClick={() => setActiveModal("apiKey")}
            color="bg-[#2c2c2e]"
            borderColor="border-[#3a3a3c]"
            hasApiKey={hasApiKey}
          />

          {/* <ActionButton
            icon={<FiStar className="text-xl text-amber-400" />}
            title={isSubscribed ? "Premium Member" : "Upgrade Subscription"}
            description={
              isSubscribed
                ? "Manage your subscription"
                : "Unlock premium features"
            }
            onClick={() => setActiveModal("upgrade")}
            color={isSubscribed ? "bg-amber-500/10" : "bg-[#2c2c2e]"}
            borderColor={
              isSubscribed ? "border-amber-500/30" : "border-[#3a3a3c]"
            }
          /> */}

          <ActionButton
            icon={<FiRefreshCw className="text-xl text-gray-400" />}
            title="Reset All Data"
            description="Start fresh with a clean slate"
            onClick={() => setActiveModal("reset")}
            color="bg-[#2c2c2e]"
            borderColor="border-[#3a3a3c]"
           
          />

          {/* <ActionButton
            icon={<FiTrash2 className="text-xl text-red-400" />}
            title="Delete Account"
            description="Permanently remove your account"
            onClick={() => setActiveModal("delete")}
            color="bg-red-500/10"
            borderColor="border-red-500/30"
          /> */}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === "export" && (
          <ExportDataModal closeModal={closeModal} />
        )}

        {activeModal === "apiKey" && (
          <SetApiKeyModal
            existingApiKey={
              userProfileData?.externalServices?.gemini?.hasApiKey
            }
            closeModal={closeModal}
          />
        )}

        {activeModal === "upgrade" && (
          <UpgradeModal
            closeModal={closeModal}
            isSubscribed={isSubscribed}
            setIsSubscribed={setIsSubscribed}
          />
        )}

        {activeModal === "reset" && <ResetDataModal closeModal={closeModal} />}

        {activeModal === "delete" && (
          <DeleteAccountModal closeModal={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
};
