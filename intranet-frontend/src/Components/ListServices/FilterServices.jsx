import { getAllStatus } from "@/api/modules/status";
import { getAllCategory } from "@/api/modules/category";

import useSelectOptions from "@/hooks/useSelectOptions";
import CustomSelect from "@/Components/Utils/Select";
import InputLabel from "@/Components/Utils/InputLabel";

export default function FilterServices({
  selectedCategories,
  setSelectedCategories,
  selectedStatus,
  setSelectedStatus,
  searchQuery,
  setSearchQuery,
}) {
  const categories = useSelectOptions(getAllCategory);
  const status = useSelectOptions(getAllStatus);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-end justify-end">
        <div className="form-control">
          <InputLabel htmlFor="Service" value="Service" />
          <input
            type="text"
            placeholder="Rechercher un service..."
            className="input input-bordered w-full sm:w-auto focus:input-primary"
            id="Service"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
        </div>


        <CustomSelect
          options={status}
          name="Statut"
          placeholder="Sélectionnez un ou plusieurs statuts..."
          selectedOption={selectedStatus}
          setSelectedOption={setSelectedStatus}
        />
        <CustomSelect
          options={categories}
          name="Catégories"
          placeholder="Sélectionnez une ou plusieurs catégories..."
          selectedOption={selectedCategories}
          setSelectedOption={setSelectedCategories}
        />
      </div>
    </>
  );
}
