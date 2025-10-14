import React from "react";
import FriendList from "./FriendList";

const FriendsSection = () => {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="  col-span-12 md:col-span-3 vh-100 ">
        <FriendList />
      </div>
      <div className="col-span-9  vh-100"></div>
    </div>
  );
};

export default FriendsSection;
