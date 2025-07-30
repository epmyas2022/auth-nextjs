"use client";

import { signOutAction } from "../server/actions";

export default function LogOutButton() {
  return (
    <button
      className="bg-red-400 text-white py-2 px-4 rounded-full font-bold cursor-pointer"
      onClick={async () => await signOutAction()}
    >
      Sign Out
    </button>
  );
}
