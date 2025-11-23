import { getAllStatus } from "@/api/modules/status";
import { getAllCategory } from "@/api/modules/category";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import CustomSelect from "@/Components/Utils/Select";

export default function FilterServices({
  selectedCategories,
  setSelectedCategories,
  selectedStatus,
  setSelectedStatus,
}) {
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState([]);

  useEffect(() => {
    handleStatus();
    handleCategories();
  }, []);

  const handleStatus = () => {
    try {
      getAllStatus().then((response) => {
        setStatus(
          response.data.map((status) => ({
            value: status.id,
            label: status.name,
          }))
        );
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleCategories = () => {
    try {
      getAllCategory().then((response) => {
        setCategories(
          response.data.map((category) => ({
            value: category.id,
            label: category.name,
          }))
        );
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-end justify-end">
        <div className="">
          <CustomSelect
            options={status}
            name="Statut"
            placeholder="Sélectionnez un statut..."
            selectedOption={selectedStatus}
            setSelectedOption={setSelectedStatus}
          />
        </div>
        <div className="">
          <CustomSelect
            options={categories}
            name="Catégories"
            placeholder="Sélectionnez une ou plusieurs catégories..."
            selectedOption={selectedCategories}
            setSelectedOption={setSelectedCategories}
          />
        </div>
      </div>
    </>
  );
}
