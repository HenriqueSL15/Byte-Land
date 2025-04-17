import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { queryClient } from "../../main.jsx";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import LoadingScreen from "../common/LoadingScreen.jsx";
import { IoCloseOutline } from "react-icons/io5";
import { useNotifications } from "../../contexts/NotificationContext.jsx";
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

const fetchNotifications = async (userId) => {
  const { data } = await axios.get(
    `https://byte-land-backend.onrender.com/users/${userId}/notifications`
  );

  return data.notifications.reverse();
};

/**
 * Notifications component displays user notifications in a modal
 * Shows both unread and read notifications with animations
 */
function Notifications() {
  const { user } = useContext(AuthContext);
  const { setShowNotifications } = useNotifications();

  const navigate = useNavigate();

  // Fetch notifications for the current user
  const {
    data: notifications,
    refetch,
    isLoadingNotifications,
    isError,
  } = useQuery({
    queryKey: ["notifications", user._id],
    queryFn: () => fetchNotifications(user._id),
    enabled: !!user._id, // Only run query if user ID exists
    staleTime: Infinity, // Data never becomes stale automatically
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  /**
   * Marks all notifications as read via API call
   */
  async function markAsReadMutationFn() {
    try {
      console.log("Fazendo mutação");
      const response = await axios.patch(
        `https://byte-land-backend.onrender.com/users/${user._id}/notifications/mark-as-read`
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Handles click on a notification, navigating to user page
   * @param {string} notificationOwnerId - ID of notification owner
   */
  const handleNotificationClick = (notificationOwnerId) => {
    setShowNotifications(false);
    navigate(`/userPage/${notificationOwnerId}`);
  };

  // Mutation to mark notifications as read
  const markAsReadMutation = useMutation({
    mutationFn: markAsReadMutationFn,
    onSuccess: () => {
      // Invalidate and refetch notifications after marking as read
      queryClient.invalidateQueries({ queryKey: ["notifications", user._id] });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        // Close modal when clicking outside content area
        if (e.target === e.currentTarget) {
          setShowNotifications(false);
        }
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="absolute w-full h-screen bg-black/40 z-50 flex items-center justify-center top-0 left-0"
    >
      {/* Notification modal container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className="w-1/3 h-2/3 bg-white rounded-lg flex flex-col relative"
      >
        {/* Modal header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:text-lg md:text-2xl lg:text-3xl font-funnel-sans"
        >
          Notificações
        </motion.h1>

        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute cursor-pointer sm:w-7 md:w-10 md:h-10 lg:w-14 lg:h-14 right-3 top-2"
        >
          <IoCloseOutline
            className="w-full h-full hover:scale-110 transform transition-all"
            onClick={() => {
              setShowNotifications(false);
              markAsReadMutation.mutate(); // Mark all as read when closing
            }}
          />
        </motion.button>

        {/* Notifications content area */}
        <div className="flex flex-col px-3 overflow-y-auto">
          {/* Unread notifications section */}
          <div className="flex flex-col gap-2">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:text-lg lg:text-xl mt-3"
            >
              Novas notificações
            </motion.h2>

            {/* Render unread notifications */}
            {notifications &&
              notifications
                .filter((notification) => !notification.read)
                .map((notification, index) => {
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      key={index}
                      className="w-full min-h-16 flex flex-col"
                    >
                      <div className="w-full min-h-1 rounded-full bg-gray-100"></div>
                      <div className="flex bg-white my-3">
                        {/* User avatar */}
                        <button
                          onClick={() =>
                            handleNotificationClick(notification.owner._id)
                          }
                          className="cursor-pointer w-20 h-full hover:scale-105 transform transition-all"
                        >
                          <img
                            src={
                              notification.owner.image ==
                              "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                                ? "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                                : `https://byte-land-backend.onrender.com/${notification.owner.image}`
                            }
                            alt="Foto do dono da notificação"
                            className="w-16 h-16 rounded-full"
                          />
                        </button>
                        {/* Notification content */}
                        <div className="flex flex-col gap-1">
                          <h1 className="text-start ml-4 text-lg font-semibold font-montserrat">
                            {notification.owner.name}
                          </h1>
                          <p className="text-start ml-4 text-lg">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
          </div>

          {/* Read notifications section */}
          <div className="flex flex-col gap-2 mt-10">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
              }}
              className="md:text-lg lg:text-xl mt-3"
            >
              Notificações já lidas
            </motion.h2>

            {/* Render read notifications */}
            {notifications &&
              notifications
                .filter((notification) => notification.read)
                .map((notification, index) => {
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.3 + index * 0.1,
                      }}
                      key={index}
                      className="w-full min-h-16 flex flex-col"
                    >
                      <div className="w-full min-h-1 rounded-full bg-gray-100"></div>
                      <div className="flex bg-white my-3">
                        {/* User avatar with fixed size */}
                        <div className="flex-shrink-0 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 mr-3">
                          <button
                            onClick={() =>
                              handleNotificationClick(notification.owner._id)
                            }
                            className="cursor-pointer hover:scale-105 transform transition-all w-full h-full"
                          >
                            <img
                              src={
                                notification.owner.image ==
                                "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                                  ? "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                                  : `https://byte-land-backend.onrender.com/${notification.owner.image}`
                              }
                              alt="Foto do dono da notificação"
                              className="w-full h-full rounded-full object-cover"
                            />
                          </button>
                        </div>
                        {/* Notification content with flexible width */}
                        <div className="flex-grow flex flex-col gap-1">
                          <h1 className="text-start text-lg font-semibold font-montserrat">
                            {notification.owner.name}
                          </h1>
                          <p className="text-start text-lg">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Notifications;
