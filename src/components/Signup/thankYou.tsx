import React from "react";
import { MdCheck } from "react-icons/md";

const ThankYouPage = () => {
  return (
    <div
      className="thankyoupage"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}
    >
      <div style={{ color: "green", fontSize: "150px" }}>
        <MdCheck />
      </div>
      <h1
        style={{ fontWeight: "bold", fontSize: "48px", marginBottom: "30px" }}
      >
        Thank You!
      </h1>
      <p style={{ color: "gray", fontSize: "20px" }}>
        You have successfully signed up.
      </p>
    </div>
  );
};

export default ThankYouPage;
