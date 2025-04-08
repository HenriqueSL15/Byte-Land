import { queryClient } from "../main.jsx";
import { useFriends } from "./FriendsContext.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";

function Friends() {
  return (
    <div className="w-full h-screen bg-black/50 absolute z-50 left-0 top-0 flex justify-center items-center">
      <div className="bg-white w-2/4 h-5/6 rounded-lg">
        <h1 className="text-3xl font-funnel-sans p-5">Amigos</h1>
        <div className="flex flex-col gap-2 p-5"></div>
      </div>
    </div>
  );
}

export default Friends;
