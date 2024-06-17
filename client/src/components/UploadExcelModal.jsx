import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const UploadExcelModal = ({ isOpen, onClose, onUpload, currentUserId }) => {
  const [file, setFile] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [errors, setErrors] = useState([]);
  const [uploadInstructions, setUploadInstructions] = useState(
    "Please ensure your Excel file has the following headers: name, email, totalSpends, visits, lastVisit."
  );

  // Ref for file input
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCustomers([]);
      setErrors([]);
      setUploadInstructions(
        "Please ensure your Excel file has the following headers: name, email, totalSpends, visits, lastVisit."
      );
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const validationErrors = [];
      const customersWithAddedBy = jsonData.map((customer, index) => {
        const formattedCustomer = {
          ...customer,
          addedBy: currentUserId,
          totalSpends: parseFloat(customer.totalSpends),
          visits: parseInt(customer.visits),
          lastVisit: customer.lastVisit ? new Date(customer.lastVisit) : null,
        };

        const customerErrors = validateCustomerData(
          formattedCustomer,
          index + 1
        );
        if (customerErrors.length > 0) {
          validationErrors.push(...customerErrors);
        }

        return formattedCustomer;
      });

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setCustomers([]);
        setUploadInstructions(
          "Please fix the following issues in your Excel file and try again."
        );
      } else {
        setCustomers(customersWithAddedBy);
        setErrors([]);
        setUploadInstructions("");
      }
    };

    reader.readAsArrayBuffer(file);

    // Clear file input value using ref
    fileInputRef.current.value = "";
    
  };

  const validateCustomerData = (customer, rowIndex) => {
    const errors = [];

    if (
      typeof customer.name !== "string" ||
      customer.name.trim().length === 0
    ) {
      errors.push("Name must be a non-empty string.");
    }

    if (!isValidEmail(customer.email)) {
      errors.push("Invalid email format.");
    }

    if (isNaN(customer.totalSpends)) {
      errors.push("Total spends must be a number.");
    }

    if (isNaN(customer.visits)) {
      errors.push("Visits must be a number.");
    }

    if (
      customer.lastVisit instanceof Date &&
      isNaN(customer.lastVisit.getTime())
    ) {
      errors.push("Invalid date format for last visit.");
    }

    return errors.length > 0 ? [`Row ${rowIndex}: ${errors.join(", ")}`] : [];
  };

  const isValidEmail = (email) => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    try {
      await onUpload(customers);
      toast.success("Customers added successfully");
      setCustomers([]);
      setErrors([]);
      setUploadInstructions(
        "Please ensure your Excel file has the following headers: name, email, totalSpends, visits, lastVisit."
      );
      setFile(null);
      // Clear file input value using ref
      fileInputRef.current.value = "";
      onClose();
    } catch (error) {
      toast.error(error.response.data.message || "Error adding customers");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Upload Customers via Excel</h2>
          <button
            onClick={() => {
              onClose();
              setCustomers([]);
              setErrors([]);
              setUploadInstructions(
                "Please ensure your Excel file has the following headers: name, email, totalSpends, visits, lastVisit."
              );
              setFile(null);
              // Clear file input value using ref
              fileInputRef.current.value = "";
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
        </div>
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleFileUpload}
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-50 transition duration-300"
          >
            Upload
          </button>
          {uploadInstructions && (
            <p className="text-gray-600 mt-2">{uploadInstructions}</p>
          )}
          {errors.length > 0 && (
            <div className="text-red-600">
              <ul className="list-disc pl-8">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          {customers.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-2">Preview:</h2>
              <div className="h-64 overflow-x-auto">
                <table className="min-w-full bg-white ">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-left">
                      <th className="py-2 px-4">NAME</th>
                      <th className="py-2 px-4">EMAIL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-2 px-4">{customer.name}</td>
                        <td className="py-2 px-4">{customer.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-black text-white py-2 rounded-lg hover:opacity-50 transition duration-300 mt-4"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadExcelModal;
