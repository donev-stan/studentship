import React, { useEffect, useState } from "react";
import { getLoggedUser } from "../../services/AuthService";

import Student from "../student/Student";
import Company from "../company/Company";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = getLoggedUser();
    setUser(loggedUser);
  }, []);

  return (
    <>
      {user && user?.type === "student" && <Student student={user} />}
      {user && user?.type === "company" && <Company company={user} />}
    </>
  );
};

export default Profile;