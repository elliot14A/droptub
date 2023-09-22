import axios from "axios";
import { FC } from "react";
import Button from "./Button";

interface LogoutButtonProps {
  callback: () => void;
}

export const LogoutButton: FC<LogoutButtonProps> = ({ callback }) => {
  const logout = async () => {
    try {
      console.log("logout");
      await axios.post("/api/logout");
    } catch (err) {
      console.error(err);
    } finally {
      callback();
    }
  };
  return (
    <div>
      <Button
        className="w-full bg-red-600 hover:bg-red-600 overflow-ellipsis truncate"
        onClick={() => logout()}
        size="small"
      >
        <div className="overflow-ellipsis truncate">Logout</div>
      </Button>
    </div>
  );
};
