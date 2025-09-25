import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaEdit, FaSave } from "react-icons/fa";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useConfirmDialog } from "../../hooks/useConfirmDialog";

const UploadModal = ({ title, existingImage, file, onSave, onClose }) => {
  const fileInputRef = useRef();
  const [localFile, setLocalFile] = useState(null);
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (localFile) {
      const url = URL.createObjectURL(localFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [localFile]);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-2 rounded-lg max-w-sm w-full m-2">
        <h2 className="mb-3 font-semibold">{title}</h2>

        <div className="h-40 w-full mb-3">
          <img
            src={preview || existingImage}
            alt="existing"
            className="h-full w-full object-cover rounded-md border"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setLocalFile(e.target.files[0])}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="mb-3 px-3 py-1 bg-green-500 text-white rounded-md"
        >
          {" "}
          {file ? "Change File" : "Choose File"}
        </button>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onSave(localFile)}
            disabled={!localFile}
            className={`px-3 py-1 rounded-md ${
              file ? "bg-blue-600 text-white" : "bg-violet-600 text-white"
            }`}
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-500 text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
const Profile = () => {
  const { auth, setAuth } = useAuth();
  const { user } = auth;
  const [editDetails, setEditDetails] = useState(false);
  const { confirm } = useConfirmDialog();
  const [userDetails, setUserDetails] = useState({
    fullName: user?.fullName,
    email: user?.email,
  });
  const [originalDetails, setOriginalDetails] = useState(userDetails);
  const [modalConfig, setModalConfig] = useState({
    type: null, // "cover" | "avatar"
    file: null,
    open: false,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (modalConfig.file instanceof File) {
      const url = URL.createObjectURL(modalConfig.file);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url); // cleanup
    } else {
      setPreviewUrl(null);
    }
  }, [modalConfig.file]);
  const handleImageSave = async (file, type) => {
    if (!(file && type)) return;

    const ok = await confirm(`Do you want to update your ${type}?`, {
      confirmText: "Update",
      icon: "warning",
    });

    if (!ok) return;
    const formData = new FormData();
    formData.append(
      modalConfig.type === "cover" ? "coverImage" : "avatar",
      file
    );
    try {
      const endpoint =
        modalConfig.type === "cover"
          ? "/users/update-cover"
          : "/users/update-avatar";
      const res = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success(`${modalConfig.type}updated successfully`);
      console.log("res", res);
      console.log("response", res?.data.user);

      if (res?.data?.data.user) {
        setAuth((prev) => ({ ...prev, user: res.data.data.user }));
        setModalConfig({ type: null, file: null, open: false });
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong while updating!");
    }
  };

  const handleChnage = (e) => {
    setUserDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editDetails) {
      // Editing start → backup current details
      setOriginalDetails(userDetails);
      setEditDetails(true);
      return;
    }
    if (
      userDetails.fullName === user?.fullName &&
      userDetails.email === user?.email
    ) {
      toast.info("No changes detected");
      setEditDetails(false);
      return;
    }
    const confirmed = await confirm("Save changes to your profile?");
    if (confirmed) {
      try {
        const res = await api.post("/users/update-profile", userDetails);
        if (res.data?.data?.user) {
          setAuth((prev) => ({ ...prev, user: res.data.data.user }));
          setOriginalDetails(res.data.data.user); // update backup
          toast.success("Profile updated successfully!");
          setEditDetails((prev) => !prev);
        }
      } catch {
        toast.error("Something went wrong while updating profile!");
      }
    } else {
      setUserDetails(originalDetails);
      setEditDetails(false);
    }
  };

  return (
    <div>
      <div className="container p-4 mx-auto ">
        <div className="header  ">
          <div className="cover-img w-full h-40  relative">
            {user?.coverImage && (
              <>
                <img
                  src={
                    modalConfig.type === "cover" && previewUrl
                      ? previewUrl
                      : user?.coverImage
                  }
                  alt={`${user.username}coverImage `}
                  className="h-full w-full object-cover bg-center"
                />
                <button
                  title="Edit Cover Image"
                  onClick={() =>
                    setModalConfig({ type: "cover", file: null, open: true })
                  }
                  className="absolute top-2 right-2 z-5 cursor-pointer bg-violet-500 p-2 rounded-full shadow-md"
                >
                  <FaEdit />
                </button>
              </>
            )}

            <div className="avatar h-20 w-20 rounded-full absolute bottom-0  overflow-hidden bg-white p-2 shadow-md">
              <img
                src={
                  modalConfig.type === "avatar" && previewUrl
                    ? previewUrl
                    : user?.avatar
                }
                alt="avatar image"
                className="rounded-full"
              />
              <button
                title="Edit Avatar Image"
                onClick={() =>
                  setModalConfig({ type: "avatar", file: null, open: true })
                }
                className="absolute bottom-2 right-2 cursor-pointer bg-violet-500 p-1 rounded-full shadow-md"
              >
                <FaEdit size={14} />
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col mt-5">
              <input
                type="text"
                className="capitalize active:ring-1 active:ring-violet-500"
                value={userDetails?.fullName}
                onChange={handleChnage}
                disabled={!editDetails}
                name="fullName"
              />
              <input
                type="email"
                name="email"
                value={userDetails?.email}
                onChange={handleChnage}
                disabled={!editDetails}
              />
            </div>
            <button
              title="Edit User Details"
              onClick={handleSubmit}
              className="cursor-pointer text-violet-500 p-1 rounded-full shadow-md"
            >
              {editDetails ? <FaSave /> : <FaEdit />}
            </button>
          </div>
        </div>
      </div>
      {modalConfig.open && (
        <UploadModal
          title={
            modalConfig.type === "cover" ? "Change Cover" : "Change Avatar"
          }
          existingImage={
            modalConfig.type === "cover" ? user?.coverImage : user?.avatar
          }
          onSave={async (file) => {
            if (!file) return;
            setModalConfig((prev) => ({ ...prev, file }));
            await handleImageSave(file, modalConfig.type);

            // modalConfig will be reset inside handleImageSave
          }}
          onClose={() =>
            setModalConfig({ type: null, file: null, open: false })
          }
        />
      )}
    </div>
  );
};

export default Profile;
