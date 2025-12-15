import React, { useState } from "react";

const KycVerification = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    documentType: "",
    documentNumber: "",
    documentFile: null,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "documentFile") {
      setFormData({ ...formData, documentFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("KYC Data:", formData);
  }
}

  
